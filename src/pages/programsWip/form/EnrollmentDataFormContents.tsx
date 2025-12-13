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

const TETA_INHERITED_TOOLTIP = i18n.t(
    'This setting is inherited from the tracked entity type and cannot be changed'
)

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

            const matchedTetaAttributes = tetas.map(
                (tetaAttribute: ProgramTrackedEntityAttribute) => {
                    const existingProgramAttribute =
                        existingProgramAttributesMap.get(
                            tetaAttribute.trackedEntityAttribute.id
                        )
                    return existingProgramAttribute ?? tetaAttribute
                }
            )

            const programTrackedEntityAttributes = input.value.filter(
                (programAttribute) =>
                    !tetaIds.has(programAttribute.trackedEntityAttribute.id)
            )

            input.onChange([
                ...matchedTetaAttributes,
                ...programTrackedEntityAttributes,
            ])
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
                                const tetaAttributes = input.value.filter(
                                    (attr) =>
                                        tetaMap.has(
                                            attr.trackedEntityAttribute.id
                                        )
                                )

                                const pteaSelected = selected.filter(
                                    (s) => !tetaMap.has(s.id)
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

                                const isTetaFieldEnabled = (
                                    field: keyof ProgramTrackedEntityAttribute
                                ) => {
                                    return teta?.[field] !== true
                                }
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
                                                <TooltipWrapper
                                                    condition={
                                                        !isTetaFieldEnabled(
                                                            'allowFutureDate'
                                                        )
                                                    }
                                                    content={
                                                        TETA_INHERITED_TOOLTIP
                                                    }
                                                >
                                                    <FieldRFF
                                                        component={
                                                            CheckboxFieldFF
                                                        }
                                                        name={`programTrackedEntityAttributes[${index}].allowFutureDate`}
                                                        type="checkbox"
                                                        disabled={
                                                            attribute?.valueType !==
                                                                'DATE' ||
                                                            !isTetaFieldEnabled(
                                                                'allowFutureDate'
                                                            )
                                                        }
                                                    />
                                                </TooltipWrapper>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <TooltipWrapper
                                                condition={
                                                    !isTetaFieldEnabled(
                                                        'mandatory'
                                                    )
                                                }
                                                content={i18n.t(
                                                    'This setting is inherited from the tracked entity type and cannot be changed'
                                                )}
                                            >
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].mandatory`}
                                                    type="checkbox"
                                                    disabled={
                                                        !isTetaFieldEnabled(
                                                            'mandatory'
                                                        )
                                                    }
                                                />
                                            </TooltipWrapper>
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
                                                <TooltipWrapper
                                                    condition={
                                                        !isTetaFieldEnabled(
                                                            'searchable'
                                                        )
                                                    }
                                                    content={
                                                        TETA_INHERITED_TOOLTIP
                                                    }
                                                >
                                                    <FieldRFF
                                                        component={
                                                            CheckboxFieldFF
                                                        }
                                                        name={`programTrackedEntityAttributes[${index}].searchable`}
                                                        type="checkbox"
                                                        disabled={
                                                            attribute
                                                                .trackedEntityAttribute
                                                                .unique ||
                                                            !isTetaFieldEnabled(
                                                                'searchable'
                                                            )
                                                        }
                                                        checked={true}
                                                    />
                                                </TooltipWrapper>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <TooltipWrapper
                                                condition={
                                                    !isTetaFieldEnabled(
                                                        'displayInList'
                                                    )
                                                }
                                                content={i18n.t(
                                                    'This setting is inherited from the tracked entity type and cannot be changed'
                                                )}
                                            >
                                                <FieldRFF
                                                    component={CheckboxFieldFF}
                                                    name={`programTrackedEntityAttributes[${index}].displayInList`}
                                                    type="checkbox"
                                                    disabled={
                                                        !isTetaFieldEnabled(
                                                            'displayInList'
                                                        )
                                                    }
                                                />
                                            </TooltipWrapper>
                                        </TableCell>
                                        <TableCell>
                                            <TooltipWrapper
                                                condition={
                                                    !!teta?.renderType?.DESKTOP
                                                        ?.type
                                                }
                                                content={TETA_INHERITED_TOOLTIP}
                                            >
                                                <RenderingOptionsSingleSelect
                                                    attribute={attribute}
                                                    index={index}
                                                    device="DESKTOP"
                                                    disabled={
                                                        !!teta?.renderType
                                                            ?.DESKTOP?.type
                                                    }
                                                />
                                            </TooltipWrapper>
                                        </TableCell>
                                        <TableCell>
                                            <TooltipWrapper
                                                condition={
                                                    !!teta?.renderType?.MOBILE
                                                        ?.type
                                                }
                                                content={TETA_INHERITED_TOOLTIP}
                                            >
                                                <RenderingOptionsSingleSelect
                                                    attribute={attribute}
                                                    index={index}
                                                    device="MOBILE"
                                                    disabled={
                                                        !!teta?.renderType
                                                            ?.MOBILE?.type
                                                    }
                                                />
                                            </TooltipWrapper>
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
