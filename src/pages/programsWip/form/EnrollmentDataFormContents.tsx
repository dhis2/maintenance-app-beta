import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    Field,
    SingleSelectFieldFF,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    ModelTransfer,
    SectionedFormSection,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import css from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer.module.css'
import { getConstantTranslation, useBoundResourceQueryFn } from '../../../lib'
import { ProgramsFromFilters } from '../Edit'

type RenderingOptionsResponse = {
    renderingTypes: string[]
    valueType: string
}[]

const RenderingOptionsSingleSelect = ({
    attribute,
    index,
    device,
}: {
    attribute: ProgramsFromFilters['programTrackedEntityAttributes'][0]
    index: number
    device: 'MOBILE' | 'DESKTOP'
}) => {
    const queryFn = useBoundResourceQueryFn()

    const { data: renderingOptionsData } = useQuery({
        queryKey: [
            {
                resource: 'staticConfiguration/renderingOptions',
                params: {
                    fields: ['renderingTypes'],
                },
            },
        ],
        queryFn: queryFn<RenderingOptionsResponse>,
    })

    return renderingOptionsData ? (
        <FieldRFF<string | undefined>
            inputWidth="100px"
            defaultValue={'DEFAULT'}
            name={`programTrackedEntityAttributes[${index}].renderType.${device}.type`}
            render={(props) => (
                <SingleSelectFieldFF
                    {...props}
                    inputWidth={'150px'}
                    options={
                        renderingOptionsData
                            ?.find((ro) => ro.valueType === attribute.valueType)
                            ?.renderingTypes.map((rt) => ({
                                value: rt,
                                label: getConstantTranslation(rt),
                            })) ?? [
                            {
                                value: 'DEFAULT',
                                label: getConstantTranslation('DEFAULT'),
                            },
                        ]
                    }
                />
            )}
        />
    ) : undefined
}

export const EnrollmentDataFormContents = React.memo(
    function SetupFormContents({ name }: { name: string }) {
        const { input, meta } = useField<
            ProgramsFromFilters['programTrackedEntityAttributes']
        >('programTrackedEntityAttributes', {
            multiple: true,
            validateFields: [],
        })
        const programHasDateAttributes = input.value.some(
            (attribute) => attribute.valueType === 'DATE'
        )

        return (
            <SectionedFormSection name={name}>
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        {i18n.t('Enrollment: Data', { nsSeparator: '~:~' })}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose the information to collect during enrollment.'
                        )}
                    </StandardFormSectionDescription>
                    <Field
                        error={meta.invalid}
                        validationText={
                            (meta.touched && meta.error?.toString()) || ''
                        }
                        name={name}
                        className={css.moduleTransferField}
                    >
                        <ModelTransfer
                            selected={input.value.map((attribute) => ({
                                id: attribute.trackedEntityAttribute.id,
                                displayName:
                                    attribute.trackedEntityAttribute
                                        .displayName,
                                valueType: attribute.valueType,
                            }))}
                            onChange={({ selected }) => {
                                input.onChange(
                                    selected.map((s) => {
                                        const alreadySelectedAttribute =
                                            input.value.find(
                                                (a) =>
                                                    a.trackedEntityAttribute
                                                        .id === s.id
                                            )

                                        return (
                                            alreadySelectedAttribute || {
                                                trackedEntityAttribute: {
                                                    id: s.id,
                                                    displayName: s.displayName,
                                                },
                                                valueType: s.valueType,
                                                allowFutureDate: false,
                                                mandatory: false,
                                                searchable: false,
                                                displayInList: false,
                                                renderType: {
                                                    MOBILE: { type: 'DEFAULT' },
                                                    DESKTOP: {
                                                        type: 'DEFAULT',
                                                    },
                                                },
                                            }
                                        )
                                    })
                                )
                                input.onBlur()
                            }}
                            leftHeader={i18n.t('Available attributes')}
                            rightHeader={i18n.t('Selected attributes')}
                            filterPlaceholder={i18n.t(
                                'Filter available attributes'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter attributes'
                            )}
                            maxSelections={Infinity}
                            query={{
                                resource: 'trackedEntityAttributes',
                                params: {
                                    fields: ['id', 'displayName', 'valueType'],
                                },
                            }}
                        />
                    </Field>
                </StandardFormSection>
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        {i18n.t('Configure data items')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Attributes can be collected in different ways with different options.'
                        )}
                    </StandardFormSectionDescription>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCellHead>{i18n.t('Name')}</TableCellHead>
                                {programHasDateAttributes && (
                                    <TableCellHead>
                                        {i18n.t('Allow future dates')}
                                    </TableCellHead>
                                )}
                                <TableCellHead>
                                    {i18n.t('Required')}
                                </TableCellHead>
                                <TableCellHead>
                                    {i18n.t('Searchable')}
                                </TableCellHead>
                                <TableCellHead>
                                    {i18n.t('Display in list')}
                                </TableCellHead>
                                <TableCellHead>
                                    {i18n.t('Desktop Display')}
                                </TableCellHead>
                                <TableCellHead>
                                    {i18n.t('Mobile Display')}
                                </TableCellHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {input.value.map((attribute, index) => {
                                return (
                                    <TableRow key={attribute.id}>
                                        <TableCell>
                                            {
                                                attribute.trackedEntityAttribute
                                                    .displayName
                                            }
                                        </TableCell>
                                        {programHasDateAttributes && (
                                            <TableCell>
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].allowFutureDate`}
                                                    type="checkbox"
                                                    disabled={
                                                        attribute?.valueType !==
                                                        'DATE'
                                                    }
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <FieldRFF
                                                component={CheckboxFieldFF}
                                                name={`programTrackedEntityAttributes[${index}].mandatory`}
                                                type="checkbox"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldRFF
                                                component={CheckboxFieldFF}
                                                name={`programTrackedEntityAttributes[${index}].searchable`}
                                                type="checkbox"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FieldRFF
                                                component={CheckboxFieldFF}
                                                name={`programTrackedEntityAttributes[${index}].displayInList`}
                                                type="checkbox"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <RenderingOptionsSingleSelect
                                                attribute={attribute}
                                                index={index}
                                                device="DESKTOP"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <RenderingOptionsSingleSelect
                                                attribute={attribute}
                                                index={index}
                                                device="MOBILE"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </StandardFormSection>
            </SectionedFormSection>
        )
    }
)
