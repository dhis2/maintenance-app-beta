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
import React, { useEffect } from 'react'
import { Field as FieldRFF, FieldRenderProps, useField } from 'react-final-form'
import {
    ModelTransfer,
    SectionedFormSection,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import css from '../../../components/metadataFormControls/ModelTransfer/ModelTransfer.module.css'
import { TooltipWrapper } from '../../../components/tooltip'
import { getConstantTranslation, useBoundResourceQueryFn } from '../../../lib'
import { ProgramTrackedEntityAttribute } from '../../../types/generated'
import { ProgramsFromFilters } from '../Edit'

type RenderingOptionsResponse = {
    renderingTypes: string[]
    valueType: string
}[]

const RenderingOptionsSingleSelect = ({
    attribute,
    index,
    device,
    disabled,
}: {
    attribute: ProgramsFromFilters['programTrackedEntityAttributes'][0]
    index: number
    device: 'MOBILE' | 'DESKTOP'
    disabled?: boolean
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
                        disabled={disabled}
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

        // Get TETAs (Tracked Entity Type Attributes) from the tracked entity type
        const tetas =
            trackedEntityTypeField.input.value?.trackedEntityTypeAttributes ||
            []
        const tetaIds = new Set(
            tetas.map(
                (teta: ProgramTrackedEntityAttribute) =>
                    teta.trackedEntityAttribute.id
            )
        )
        const tetaIdsString = Array.from(tetaIds).join(',')
        const tetaMap = new Map<string, ProgramTrackedEntityAttribute>(
            tetas.map((teta: ProgramTrackedEntityAttribute) => [
                teta.trackedEntityAttribute.id,
                teta,
            ])
        )

        // Sync TETAs with program attributes when tracked entity type changes
        useEffect(() => {
            if (!trackedEntityTypeField.input.value?.id) {
                return
            }

            const defaultRenderType = {
                MOBILE: { type: 'DEFAULT' },
                DESKTOP: { type: 'DEFAULT' },
            }

            const existingProgramAttributesMap = new Map(
                input.value.map((programAttribute) => [
                    programAttribute.trackedEntityAttribute.id,
                    programAttribute,
                ])
            )

            // Convert TETAs to PETA structure, preserving existing PETA values if they exist
            const convertedTetas = tetas.map(
                (teta: ProgramTrackedEntityAttribute) => {
                    const existing = existingProgramAttributesMap.get(
                        teta.trackedEntityAttribute.id
                    )
                    return (
                        existing || {
                            trackedEntityAttribute: teta.trackedEntityAttribute,
                            valueType: teta.trackedEntityAttribute.valueType,
                            unique: teta.trackedEntityAttribute.unique,
                            allowFutureDate: false,
                            mandatory: teta.mandatory || false,
                            searchable: false,
                            displayInList: false,
                            renderType: defaultRenderType,
                        }
                    )
                }
            )

            // Keep only PETAs (non-TETAs) from existing program attributes
            const petas = input.value.filter(
                (programAttribute) =>
                    !tetaIds.has(programAttribute.trackedEntityAttribute.id)
            )

            // Merge: TETAs first, then PETAs
            input.onChange([...convertedTetas, ...petas])
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [trackedEntityTypeField.input.value?.id, tetaIdsString])
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
                                const isTETA = tetaMap.has(tea.id)
                                return {
                                    ...tea,
                                    ...(isTETA && {
                                        displayName: `${tea.displayName} (Tracked entity type attribute)`,
                                    }),
                                }
                            })}
                            onChange={({ selected }) => {
                                const defaultRenderType = {
                                    MOBILE: { type: 'DEFAULT' },
                                    DESKTOP: { type: 'DEFAULT' },
                                }

                                // Create map of existing attributes to preserve configurations
                                const existingAttributesMap = new Map(
                                    input.value.map((attr) => [
                                        attr.trackedEntityAttribute.id,
                                        attr,
                                    ])
                                )

                                // Track original indices of TETAs for re-insertion at correct position
                                const tetaOriginalIndices = new Map<
                                    string,
                                    number
                                >(
                                    input.value
                                        .map(
                                            (attr, index) =>
                                                [
                                                    attr.trackedEntityAttribute
                                                        .id,
                                                    index,
                                                ] as [string, number]
                                        )
                                        .filter(([id]) => tetaIds.has(id))
                                )

                                const selectedIds = new Set(
                                    selected.map((s) => s.id)
                                )

                                // TETAs that user didn't include in selection (must be re-added at original position)
                                const missingTetas = input.value.filter(
                                    (attr) =>
                                        tetaIds.has(
                                            attr.trackedEntityAttribute.id
                                        ) &&
                                        !selectedIds.has(
                                            attr.trackedEntityAttribute.id
                                        )
                                )

                                // Process selected attributes in user's chosen order
                                const selectedAttributes = selected.map((s) => {
                                    const existing = existingAttributesMap.get(
                                        s.id
                                    )
                                    return (
                                        existing || {
                                            trackedEntityAttribute: {
                                                id: s.id,
                                                displayName: s.displayName,
                                            },
                                            valueType: s.valueType,
                                            unique: s.unique,
                                            allowFutureDate: false,
                                            mandatory: tetaIds.has(s.id)
                                                ? tetaMap.get(s.id)
                                                      ?.mandatory || false
                                                : false,
                                            searchable: false,
                                            displayInList: false,
                                            renderType: defaultRenderType,
                                        }
                                    )
                                })

                                const result = [...selectedAttributes]
                                missingTetas.forEach((teta) => {
                                    const originalIndex =
                                        tetaOriginalIndices.get(
                                            teta.trackedEntityAttribute.id
                                        )
                                    if (originalIndex !== undefined) {
                                        // Ensure TETA has renderType when re-inserted
                                        const tetaWithDefaults = {
                                            ...teta,
                                            renderType:
                                                teta.renderType ||
                                                defaultRenderType,
                                        }
                                        result.splice(
                                            originalIndex,
                                            0,
                                            tetaWithDefaults
                                        )
                                    }
                                })

                                input.onChange(result)
                                input.onBlur()
                            }}
                            leftHeader={i18n.t('Available attributes')}
                            rightHeader={i18n.t('Selected attributes')}
                            filterPlaceholder={i18n.t(
                                'Filter available attributes'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected attributes'
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
                                    filter: tetaIdsString
                                        ? [`id:!in:[${tetaIdsString}]`]
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
                                const teta = tetaMap.get(
                                    attribute.trackedEntityAttribute.id
                                )
                                const isTETA = !!teta
                                const isMandatoryDisabled =
                                    teta?.mandatory === true

                                return (
                                    <TableRow key={attribute.id}>
                                        <TableCell>
                                            {`${
                                                attribute.trackedEntityAttribute
                                                    .displayName
                                            } ${
                                                isTETA
                                                    ? ' (Tracked entity type attribute)'
                                                    : ''
                                            }`}
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
                                            <TooltipWrapper
                                                condition={isMandatoryDisabled}
                                                content={i18n.t(
                                                    'This attribute is marked as required at the tracked entity type level'
                                                )}
                                            >
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].mandatory`}
                                                    type="checkbox"
                                                    disabled={
                                                        isMandatoryDisabled
                                                    }
                                                />
                                            </TooltipWrapper>
                                        </TableCell>
                                        <TableCell>
                                            {attribute.trackedEntityAttribute
                                                .unique ? (
                                                <TooltipWrapper
                                                    condition={true}
                                                    content={i18n.t(
                                                        'Unique attributes are always searchable'
                                                    )}
                                                >
                                                    <CheckboxField
                                                        name="searchable"
                                                        checked
                                                        disabled
                                                    />
                                                </TooltipWrapper>
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
