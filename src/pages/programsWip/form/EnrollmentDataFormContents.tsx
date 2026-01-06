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

const defaultRenderType = {
    MOBILE: { type: 'DEFAULT' },
    DESKTOP: { type: 'DEFAULT' },
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

        // Track previous TETAs to remove them when tracked entity type changes
        const previousTetaIdsRef = useRef<Set<string>>(new Set())

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

            // Map existing program attributes by ID for quick lookup
            const existingProgramAttributesMap = new Map(
                input.value.map((programAttribute) => [
                    programAttribute.trackedEntityAttribute.id,
                    programAttribute,
                ])
            )

            // Convert TETAs to program attribute structure, preserving existing configurations
            const convertedTetas = tetas.map(
                (teta: ProgramTrackedEntityAttribute) => {
                    const existing = existingProgramAttributesMap.get(
                        teta.trackedEntityAttribute.id
                    )
                    // If attribute exists, preserve its configuration (but ensure mandatory is true if TETA requires it)
                    if (existing) {
                        return {
                            ...existing,
                            mandatory:
                                teta.mandatory === true
                                    ? true
                                    : existing.mandatory,
                        }
                    }
                    // If new TETA, create with config inherited from tracked entity type
                    return {
                        trackedEntityAttribute: teta.trackedEntityAttribute,
                        valueType: teta.trackedEntityAttribute.valueType,
                        unique: teta.trackedEntityAttribute.unique,
                        allowFutureDate: false,
                        mandatory: teta.mandatory || false,
                        searchable: teta.searchable || false,
                        displayInList: teta.displayInList || false,
                        renderType: defaultRenderType,
                    }
                }
            )

            // Keep only PTEAs: filter out both current and previous TETAs
            const petas = input.value.filter((programAttribute) => {
                const attrId = programAttribute.trackedEntityAttribute.id
                // Remove if it's a TETA from current tracked entity type
                if (tetaIds.has(attrId)) {
                    return false
                }
                // Remove if it was a TETA from previous tracked entity type
                if (previousTetaIdsRef.current.has(attrId)) {
                    return false
                }
                // Keep as PTEA
                return true
            })

            // Update ref with current TETA IDs for next change
            previousTetaIdsRef.current = tetaIds

            // Merge: TETAs first, then PTEAs
            input.onChange([...convertedTetas, ...petas])
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [trackedEntityTypeField.input.value?.id, tetaIdsString])
        // Check if any date attributes exist (for conditional column display)
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
                            'Choose the information to collect during enrollment. Attributes from the tracked entity type are automatically included and cannot be removed.'
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
                                // Add suffix to TETA display names for clear identification
                                return {
                                    ...tea,
                                    displayName: isTETA
                                        ? `${tea.displayName} (Tracked entity type attribute)`
                                        : tea.displayName,
                                }
                            })}
                            onChange={({ selected }) => {
                                // Map existing attributes by ID to preserve their configurations
                                const existingAttributesMap = new Map(
                                    input.value.map((attr) => [
                                        attr.trackedEntityAttribute.id,
                                        attr,
                                    ])
                                )

                                // Track TETA original positions to maintain order
                                const tetaOriginalIndices = new Map<
                                    string,
                                    number
                                >()
                                input.value.forEach((attr, index) => {
                                    if (
                                        tetaIds.has(
                                            attr.trackedEntityAttribute.id
                                        )
                                    ) {
                                        tetaOriginalIndices.set(
                                            attr.trackedEntityAttribute.id,
                                            index
                                        )
                                    }
                                })

                                const selectedIds = new Set(
                                    selected.map((s) => s.id)
                                )

                                // Find TETAs that user tried to remove (must be kept)
                                const missingTetas = input.value.filter(
                                    (attr) =>
                                        tetaIds.has(
                                            attr.trackedEntityAttribute.id
                                        ) &&
                                        !selectedIds.has(
                                            attr.trackedEntityAttribute.id
                                        )
                                )

                                // Map user selection to program attribute structure
                                const selectedAttributes = selected.map((s) => {
                                    const existing = existingAttributesMap.get(
                                        s.id
                                    )
                                    // Preserve existing configuration if attribute was already selected
                                    if (existing) {
                                        return existing
                                    }
                                    // Create new program attribute with default values
                                    return {
                                        trackedEntityAttribute: {
                                            id: s.id,
                                            displayName: s.displayName,
                                        },
                                        valueType: s.valueType,
                                        unique: s.unique,
                                        allowFutureDate: false,
                                        mandatory: tetaIds.has(s.id)
                                            ? tetaMap.get(s.id)?.mandatory ||
                                              false
                                            : false,
                                        searchable: false,
                                        displayInList: false,
                                        renderType: defaultRenderType,
                                    }
                                })

                                // Re-insert TETAs that user tried to remove
                                const result = [...selectedAttributes]
                                missingTetas.forEach((teta) => {
                                    const originalIndex =
                                        tetaOriginalIndices.get(
                                            teta.trackedEntityAttribute.id
                                        )
                                    if (originalIndex !== undefined) {
                                        result.splice(
                                            Math.min(
                                                originalIndex,
                                                result.length
                                            ),
                                            0,
                                            {
                                                ...teta,
                                                renderType:
                                                    teta.renderType ||
                                                    defaultRenderType,
                                            }
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
                            'Configure how attributes are displayed and validated. Some options are restricted for tracked entity type attributes.'
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
                                const attributeId =
                                    attribute.trackedEntityAttribute.id
                                const teta = tetaMap.get(attributeId)
                                const isTETA = !!teta
                                const isMandatoryDisabled =
                                    teta?.mandatory === true

                                return (
                                    <TableRow key={attribute.id || attributeId}>
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
                                                    format={(value) =>
                                                        isMandatoryDisabled
                                                            ? true
                                                            : value
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
