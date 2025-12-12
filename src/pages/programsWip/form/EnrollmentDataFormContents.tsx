import i18n from '@dhis2/d2-i18n'
import {
    CheckboxField,
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
import React, { useEffect, useRef } from 'react'
import { Field as FieldRFF, FieldRenderProps, useField } from 'react-final-form'
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

    const { data, isLoading } = useQuery({
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

    const optionsFromData =
        data
            ?.find((ro) => ro.valueType === attribute.valueType)
            ?.renderingTypes.map((rt) => ({
                value: rt,
                label: getConstantTranslation(rt),
            })) ?? []

    return (
        <FieldRFF<string | undefined>
            inputWidth="100px"
            defaultValue={'DEFAULT'}
            name={`programTrackedEntityAttributes[${index}].renderType.${device}.type`}
            render={(props: FieldRenderProps<string | undefined>) => {
                const selectedOptions =
                    props.input.value &&
                    (!data ||
                        data.length === 0 ||
                        !optionsFromData.some(
                            (o) => o.value === props.input.value
                        ))
                        ? [
                              {
                                  value: props.input.value,
                                  label: getConstantTranslation(
                                      props.input.value
                                  ),
                              },
                          ]
                        : []

                const defaultOptions =
                    (optionsFromData && optionsFromData.length > 0) ||
                    selectedOptions.length
                        ? []
                        : [
                              {
                                  value: 'DEFAULT',
                                  label: getConstantTranslation('DEFAULT'),
                              },
                          ]

                return (
                    <SingleSelectFieldFF
                        {...props}
                        inputWidth={'150px'}
                        loading={isLoading}
                        options={[
                            ...defaultOptions,
                            ...selectedOptions,
                            ...optionsFromData,
                        ]}
                    />
                )
            }}
        />
    )
}

export const EnrollmentDataFormContents = React.memo(
    function SetupFormContents({ name }: { name: string }) {
        const { input, meta } = useField<
            ProgramsFromFilters['programTrackedEntityAttributes']
        >('programTrackedEntityAttributes', {
            multiple: true,
            validateFields: [],
        })

        const trackedEntityTypeField = useField<
            ProgramsFromFilters['trackedEntityType']
        >('trackedEntityType', {
            subscription: { value: true },
        })

        const tetas =
            trackedEntityTypeField.input.value?.trackedEntityTypeAttributes ||
            []
        const tetaIds = tetas.map((teta: any) => teta.trackedEntityAttribute.id)
        const previousTetaIds = useRef<string[]>([])

        useEffect(() => {
            if (!trackedEntityTypeField.input.value?.id) {
                return
            }

            const ptea = input.value.filter(
                (attr) =>
                    !previousTetaIds.current.includes(
                        attr.trackedEntityAttribute.id
                    )
            )

            input.onChange([...tetas, ...ptea])
            previousTetaIds.current = tetaIds
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [trackedEntityTypeField.input.value?.id, tetaIds.join(',')])

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
                            selected={input.value.map((attribute) => {
                                const tea = attribute.trackedEntityAttribute
                                const isTETA = tetaIds?.includes(tea.id)
                                return {
                                    ...tea,
                                    ...(isTETA && {
                                        displayName: `${tea.displayName} (Tracked entity type attribute)`,
                                    }),
                                }
                            })}
                            onChange={({ selected }) => {
                                const tetaAttributes = input.value.filter(
                                    (attr) =>
                                        tetaIds?.includes(
                                            attr.trackedEntityAttribute.id
                                        )
                                )

                                const pteaSelected = selected.filter(
                                    (s) => !tetaIds?.includes(s.id)
                                )

                                input.onChange([
                                    ...tetaAttributes,
                                    ...pteaSelected.map((s) => {
                                        const defaultRenderType = {
                                            MOBILE: { type: 'DEFAULT' },
                                            DESKTOP: {
                                                type: 'DEFAULT',
                                            },
                                        }
                                        const alreadySelectedAttribute =
                                            input.value.find(
                                                (a) =>
                                                    a.trackedEntityAttribute
                                                        .id === s.id
                                            )

                                        return alreadySelectedAttribute
                                            ? {
                                                  ...alreadySelectedAttribute,
                                                  renderType:
                                                      alreadySelectedAttribute.renderType ??
                                                      defaultRenderType,
                                              }
                                            : {
                                                  trackedEntityAttribute: {
                                                      id: s.id,
                                                      displayName:
                                                          s.displayName,
                                                  },
                                                  valueType: s.valueType,
                                                  unique: s.unique,
                                                  allowFutureDate: false,
                                                  mandatory: false,
                                                  searchable: false,
                                                  displayInList: false,
                                                  renderType: defaultRenderType,
                                              }
                                    }),
                                ])
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
                                    fields: [
                                        'id',
                                        'displayName',
                                        'valueType',
                                        'unique',
                                    ],
                                    filter:
                                        tetaIds.length > 0
                                            ? [`id:!in:[${tetaIds.join(',')}]`]
                                            : undefined,
                                },
                            }}
                        />
                    </Field>
                </StandardFormSection>
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        {i18n.t('Configure attributes')}
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
                                            {attribute.trackedEntityAttribute
                                                .unique ? (
                                                <CheckboxField
                                                    name="searchable"
                                                    checked
                                                    disabled
                                                />
                                            ) : (
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].searchable`}
                                                    type="checkbox"
                                                    disabled={
                                                        attribute
                                                            .trackedEntityAttribute
                                                            .unique
                                                    }
                                                    checked={true}
                                                />
                                            )}
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
