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

        const previousTetaIdsRef = useRef<Set<string>>(new Set())

        const tetas =
            trackedEntityTypeField.input.value?.trackedEntityTypeAttributes ||
            []

        const tetaMap = new Map<string, ProgramTrackedEntityAttribute>(
            tetas.map((teta: ProgramTrackedEntityAttribute) => [
                teta.trackedEntityAttribute.id,
                teta,
            ])
        )

        const tetaIds = new Set(tetaMap.keys())

        const tetaIdsString = Array.from(tetaIds).join(',')

        useEffect(() => {
            if (!trackedEntityTypeField.input.value?.id) {
                return
            }

            const existingProgramAttributesMap = new Map(
                input.value.map((programAttribute) => [
                    programAttribute.trackedEntityAttribute.id,
                    programAttribute,
                ])
            )

            const convertedTetas = tetas.map(
                (teta: ProgramTrackedEntityAttribute) => {
                    const existing = existingProgramAttributesMap.get(
                        teta.trackedEntityAttribute.id
                    )

                    if (
                        existing &&
                        !previousTetaIdsRef.current.has(
                            teta.trackedEntityAttribute.id
                        )
                    ) {
                        return existing
                    }

                    return {
                        trackedEntityAttribute: teta.trackedEntityAttribute,
                        valueType: teta.trackedEntityAttribute.valueType,
                        unique: teta.trackedEntityAttribute.unique,
                        allowFutureDate: false,
                        mandatory: teta.mandatory,
                        searchable: teta.searchable,
                        displayInList: teta.displayInList,
                        renderType: defaultRenderType,
                    }
                }
            )

            const petas = input.value.filter((programAttribute) => {
                const attrId = programAttribute.trackedEntityAttribute.id

                if (tetaIds.has(attrId)) {
                    return false
                }

                if (previousTetaIdsRef.current.has(attrId)) {
                    return false
                }

                return true
            })

            previousTetaIdsRef.current = tetaIds

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
                                const isTeta = tetaMap.has(tea.id)

                                return {
                                    ...tea,
                                    displayName: isTeta
                                        ? `${tea.displayName} (Tracked entity type attribute)`
                                        : tea.displayName,
                                }
                            })}
                            onChange={({ selected }) => {
                                const existingAttributesMap = new Map(
                                    input.value.map((attr) => [
                                        attr.trackedEntityAttribute.id,
                                        attr,
                                    ])
                                )

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

                                const selectedAttributes = selected.map((s) => {
                                    const existing = existingAttributesMap.get(
                                        s.id
                                    )
                                    if (existing) {
                                        return existing
                                    }

                                    return {
                                        trackedEntityAttribute: {
                                            id: s.id,
                                            displayName: s.displayName,
                                        },
                                        valueType: s.valueType,
                                        unique: s.unique,
                                        allowFutureDate: false,
                                        mandatory: false,
                                        searchable: false,
                                        displayInList: false,
                                        renderType: defaultRenderType,
                                    }
                                })

                                // Temperary functionoutality to re-insert TETAs that the user tried to remove
                                // Should be removed if transfer arrow buttons gets conditionally disabling
                                const missingTetas = input.value
                                    .filter(
                                        (attr) =>
                                            tetaIds.has(
                                                attr.trackedEntityAttribute.id
                                            ) &&
                                            !selectedIds.has(
                                                attr.trackedEntityAttribute.id
                                            )
                                    )
                                    .map((teta) => ({
                                        teta: {
                                            ...teta,
                                            renderType:
                                                teta.renderType ||
                                                defaultRenderType,
                                        },
                                        index:
                                            tetaOriginalIndices.get(
                                                teta.trackedEntityAttribute.id
                                            ) ?? Infinity,
                                    }))
                                    .sort((a, b) => a.index - b.index)

                                const result = [...selectedAttributes]
                                missingTetas.forEach(({ teta, index }) => {
                                    result.splice(
                                        Math.min(index, result.length),
                                        0,
                                        teta
                                    )
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
                                const attributeId =
                                    attribute.trackedEntityAttribute.id
                                const teta = tetaMap.get(attributeId)
                                const isMandatoryDisabled =
                                    teta?.mandatory === true

                                return (
                                    <TableRow key={attribute.id || attributeId}>
                                        <TableCell>
                                            {`${
                                                attribute.trackedEntityAttribute
                                                    .displayName
                                            } ${
                                                teta
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
                                            <TooltipWrapper
                                                condition={
                                                    attribute
                                                        .trackedEntityAttribute
                                                        .unique
                                                }
                                                content={i18n.t(
                                                    'Unique attributes are always searchable'
                                                )}
                                            >
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].searchable`}
                                                    type="checkbox"
                                                    disabled={
                                                        attribute
                                                            .trackedEntityAttribute
                                                            .unique
                                                    }
                                                    format={(value) =>
                                                        attribute
                                                            .trackedEntityAttribute
                                                            .unique
                                                            ? true
                                                            : value
                                                    }
                                                />
                                            </TooltipWrapper>
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
