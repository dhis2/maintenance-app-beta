import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    InputFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import {
    ExpressionBuilderEntry,
    FormBase,
    FormFooterWrapper,
    SectionedFormErrorNotice,
    SectionedFormLayout,
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { PaddedContainer } from '../../../../components/ExpressionBuilder/PaddedContainer'
import { ModelSingleSelectFormField } from '../../../../components/metadataFormControls/ModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../../lib'
import { ProgramRuleAction } from '../../../../types/generated'
import { PROGRAM_RULE_ACTION_TYPE_OPTIONS } from './programRuleActionTypeConstants'
import type { ProgramRuleActionListItem } from './types'

const DISPLAY_WIDGET_LOCATION_OPTIONS = [
    { label: i18n.t('Feedback'), value: 'FEEDBACK' },
    { label: i18n.t('Indicators'), value: 'INDICATORS' },
]

type DataElementWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}
type TrackedEntityAttributeWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}

type ProgramRuleActionFormValues = Partial<ProgramRuleActionListItem> & {
    programRule?: { id: string }
    dataElement?:
        | DataElementWithOptionSet
        | { id: string; displayName?: string }
    trackedEntityAttribute?:
        | TrackedEntityAttributeWithOptionSet
        | { id: string; displayName?: string }
}

const initialValuesNew = (
    programRuleId: string
): ProgramRuleActionFormValues => ({
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    programRuleActionType: ProgramRuleAction.programRuleActionType.SHOWWARNING,
    priority: undefined,
    content: '',
    data: '',
    location: '',
    programRule: { id: programRuleId },
})

function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): Record<string, string> | undefined {
    const errors: Record<string, string> = {}
    const actionType = values.programRuleActionType
    const hasDataElement = !!values.dataElement?.id
    const hasTrackedEntityAttribute = !!values.trackedEntityAttribute?.id
    const hasContent = !!values.content?.trim()
    const hasData = !!values.data?.trim()
    const hasOption = !!values.option?.id
    const hasOptionGroup = !!values.optionGroup?.id

    if (actionType === ProgramRuleAction.programRuleActionType.HIDEFIELD) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select at least one: data element or tracked entity attribute'
            )
            errors.trackedEntityAttribute = i18n.t(
                'Select at least one: data element or tracked entity attribute'
            )
        }
    }
    if (
        actionType === ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD
    ) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Data element or tracked entity attribute must be selected'
            )
            errors.trackedEntityAttribute = i18n.t(
                'Data element or tracked entity attribute must be selected'
            )
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.ASSIGN) {
        if (!hasDataElement && !hasTrackedEntityAttribute && !hasContent) {
            errors.dataElement = i18n.t(
                'Select one of: data element, tracked entity attribute, or program rule variable'
            )
            errors.trackedEntityAttribute = errors.dataElement
            errors.content = errors.dataElement
        }
        if (!hasData) {
            errors.data = i18n.t('Expression to assign is required')
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.HIDEOPTION) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select a data element or tracked entity attribute with option set'
            )
            errors.trackedEntityAttribute = errors.dataElement
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOption) {
            errors.option = i18n.t('Option to hide is required')
        }
    }
    if (
        actionType ===
            ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP ||
        actionType === ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP
    ) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select a data element or tracked entity attribute with option set'
            )
            errors.trackedEntityAttribute = errors.dataElement
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOptionGroup) {
            errors.optionGroup = i18n.t(
                actionType ===
                    ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP
                    ? 'Option group to show is required'
                    : 'Option group to hide is required'
            )
        }
    }
    return Object.keys(errors).length ? errors : undefined
}

function optionSetIdFromOptionAction(
    values: ProgramRuleActionFormValues
): string | undefined {
    const de = values.dataElement as DataElementWithOptionSet | undefined
    const tea = values.trackedEntityAttribute as
        | TrackedEntityAttributeWithOptionSet
        | undefined
    return de?.optionSet?.id ?? tea?.optionSet?.id
}

const DISPLAY_WIDGET_LOCATION_VALUES: readonly string[] = [
    'FEEDBACK',
    'INDICATORS',
]

function normalizeLocation(location: string | undefined): string {
    if (!location) {
        return ''
    }
    const upper = location.toUpperCase()
    return DISPLAY_WIDGET_LOCATION_VALUES.includes(upper) ? upper : location
}

export const ProgramRuleActionForm = ({
    programRuleId,
    programId,
    action,
    onCancel,
    onSubmitted,
}: {
    programRuleId: string
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}) => {
    const initialValues: ProgramRuleActionFormValues = action
        ? ({
              ...action,
              location: normalizeLocation(action.location),
              programRule: { id: programRuleId },
          } as ProgramRuleActionFormValues)
        : initialValuesNew(programRuleId)

    return (
        <FormBase
            onSubmit={(values) => {
                const submitted = {
                    ...values,
                    programRule: undefined,
                } as ProgramRuleActionListItem
                onSubmitted(submitted)
            }}
            initialValues={initialValues}
            validate={validateProgramRuleAction}
            subscription={{}}
            includeAttributes={false}
        >
            {({ handleSubmit }) => (
                <ProgramRuleActionFormContents
                    handleSubmit={handleSubmit}
                    programId={programId}
                    action={action}
                    onCancel={onCancel}
                    programRuleActionTypeOptions={
                        PROGRAM_RULE_ACTION_TYPE_OPTIONS
                    }
                    displayWidgetLocationOptions={
                        DISPLAY_WIDGET_LOCATION_OPTIONS
                    }
                />
            )}
        </FormBase>
    )
}

function ProgramRuleActionFormContents({
    handleSubmit,
    programId,
    action,
    onCancel,
    programRuleActionTypeOptions,
    displayWidgetLocationOptions,
}: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    programRuleActionTypeOptions: Array<{ label: string; value: string }>
    displayWidgetLocationOptions: Array<{ label: string; value: string }>
}) {
    const { values } = useFormState({ subscription: { values: true } })
    const actionType = values.programRuleActionType as string | undefined

    return (
        <form onSubmit={handleSubmit}>
            <SectionedFormLayout>
                <SectionedFormSection name="action">
                    <StandardFormSectionTitle>
                        {action
                            ? i18n.t('Edit program rule action')
                            : i18n.t('Add program rule action')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure the program rule action type and content.'
                        )}
                    </StandardFormSectionDescription>

                    <StandardFormField>
                        <Field
                            name="programRuleActionType"
                            label={i18n.t('Action')}
                            component={SingleSelectFieldFF}
                            options={programRuleActionTypeOptions}
                            dataTest="program-rule-action-type"
                            required
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <Field
                            name="priority"
                            label={i18n.t('Priority')}
                            component={InputFieldFF}
                            dataTest="program-rule-action-priority"
                        />
                    </StandardFormField>

                    {/* DISPLAYTEXT */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.DISPLAYTEXT && (
                        <>
                            <StandardFormField>
                                <Field
                                    name="location"
                                    label={i18n.t('Display widget')}
                                    component={SingleSelectFieldFF}
                                    options={displayWidgetLocationOptions}
                                    dataTest="program-rule-action-location"
                                    required
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <Field
                                    name="content"
                                    label={i18n.t('Static text')}
                                    component={InputFieldFF}
                                    dataTest="program-rule-action-content"
                                    required
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <PaddedContainer>
                                    <ExpressionBuilderEntry
                                        fieldName="data"
                                        title={i18n.t('Edit expression')}
                                        editButtonText={i18n.t(
                                            'Edit expression'
                                        )}
                                        setUpButtonText={i18n.t(
                                            'Set up expression'
                                        )}
                                        validationResource="programRules/condition/description"
                                        clearable
                                        programId={programId}
                                        type="default"
                                    />
                                </PaddedContainer>
                                <span className="helper-text">
                                    {i18n.t(
                                        'Expression to evaluate and display after static text.'
                                    )}
                                </span>
                            </StandardFormField>
                        </>
                    )}

                    {/* DISPLAYKEYVALUEPAIR */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType
                            .DISPLAYKEYVALUEPAIR && (
                        <>
                            <StandardFormField>
                                <Field
                                    name="location"
                                    label={i18n.t('Display widget')}
                                    component={SingleSelectFieldFF}
                                    options={displayWidgetLocationOptions}
                                    dataTest="program-rule-action-location"
                                    required
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <Field
                                    name="content"
                                    label={i18n.t('Key label')}
                                    component={InputFieldFF}
                                    dataTest="program-rule-action-content"
                                    required
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <PaddedContainer>
                                    <ExpressionBuilderEntry
                                        fieldName="data"
                                        title={i18n.t('Edit expression')}
                                        editButtonText={i18n.t(
                                            'Edit expression'
                                        )}
                                        setUpButtonText={i18n.t(
                                            'Set up expression'
                                        )}
                                        validationResource="programRules/condition/description"
                                        clearable
                                        programId={programId}
                                        type="default"
                                    />
                                </PaddedContainer>
                                <span className="helper-text">
                                    {i18n.t(
                                        'Expression to evaluate and display as value.'
                                    )}
                                </span>
                            </StandardFormField>
                        </>
                    )}

                    {/* HIDEFIELD */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.HIDEFIELD &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={i18n.t('Data element to hide')}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={i18n.t(
                                            'Tracked entity attribute to hide'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <Field
                                        name="content"
                                        label={i18n.t(
                                            'Custom message for blanked field'
                                        )}
                                        component={InputFieldFF}
                                        dataTest="program-rule-action-content"
                                    />
                                </StandardFormField>
                            </>
                        )}

                    {/* HIDESECTION */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.HIDESECTION &&
                        programId && (
                            <StandardFormField>
                                <ProgramStageSectionSelect
                                    programId={programId}
                                    label={i18n.t(
                                        'Program stage section to hide'
                                    )}
                                />
                            </StandardFormField>
                        )}

                    {/* HIDEPROGRAMSTAGE */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType
                            .HIDEPROGRAMSTAGE &&
                        programId && (
                            <StandardFormField>
                                <ModelSingleSelectFormField
                                    name="programStage"
                                    label={i18n.t('Program stage')}
                                    required
                                    query={{
                                        resource: 'programStages',
                                        params: {
                                            fields: ['id', 'displayName'],
                                            filter: `program.id:eq:${programId}`,
                                            paging: false,
                                        },
                                    }}
                                    inputWidth="400px"
                                    dataTest="program-rule-action-program-stage"
                                />
                            </StandardFormField>
                        )}

                    {/* SHOWWARNING, SHOWERROR, WARNINGONCOMPLETE, ERRORONCOMPLETE - same pattern */}
                    {(actionType ===
                        ProgramRuleAction.programRuleActionType.SHOWWARNING ||
                        actionType ===
                            ProgramRuleAction.programRuleActionType.SHOWERROR ||
                        actionType ===
                            ProgramRuleAction.programRuleActionType
                                .WARNINGONCOMPLETE ||
                        actionType ===
                            ProgramRuleAction.programRuleActionType
                                .ERRORONCOMPLETE) &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={
                                            actionType ===
                                                ProgramRuleAction
                                                    .programRuleActionType
                                                    .SHOWWARNING ||
                                            actionType ===
                                                ProgramRuleAction
                                                    .programRuleActionType
                                                    .WARNINGONCOMPLETE
                                                ? i18n.t(
                                                      'Data element to display warning next to'
                                                  )
                                                : i18n.t(
                                                      'Data element to display error next to'
                                                  )
                                        }
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={
                                            actionType ===
                                                ProgramRuleAction
                                                    .programRuleActionType
                                                    .SHOWWARNING ||
                                            actionType ===
                                                ProgramRuleAction
                                                    .programRuleActionType
                                                    .WARNINGONCOMPLETE
                                                ? i18n.t(
                                                      'Tracked entity attribute to display warning next to'
                                                  )
                                                : i18n.t(
                                                      'Tracked entity attribute to display error next to'
                                                  )
                                        }
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <Field
                                        name="content"
                                        label={i18n.t('Static text')}
                                        component={InputFieldFF}
                                        dataTest="program-rule-action-content"
                                        required
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <PaddedContainer>
                                        <ExpressionBuilderEntry
                                            fieldName="data"
                                            title={i18n.t('Edit expression')}
                                            editButtonText={i18n.t(
                                                'Edit expression'
                                            )}
                                            setUpButtonText={i18n.t(
                                                'Set up expression'
                                            )}
                                            validationResource="programRules/condition/description"
                                            clearable
                                            programId={programId}
                                            type="default"
                                        />
                                    </PaddedContainer>
                                    <span className="helper-text">
                                        {i18n.t(
                                            'Expression to evaluate and display after static text.'
                                        )}
                                    </span>
                                </StandardFormField>
                            </>
                        )}

                    {/* SETMANDATORYFIELD */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType
                            .SETMANDATORYFIELD &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={i18n.t(
                                            'Data element to display error next to'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={i18n.t(
                                            'Tracked entity attribute to display error next to'
                                        )}
                                    />
                                </StandardFormField>
                            </>
                        )}

                    {/* ASSIGN */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.ASSIGN &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={i18n.t(
                                            'Data element to assign to'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={i18n.t(
                                            'Tracked entity attribute to assign to'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <ProgramRuleVariableSelect
                                        programId={programId}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <PaddedContainer>
                                        <ExpressionBuilderEntry
                                            fieldName="data"
                                            title={i18n.t('Edit expression')}
                                            editButtonText={i18n.t(
                                                'Edit expression'
                                            )}
                                            setUpButtonText={i18n.t(
                                                'Set up expression'
                                            )}
                                            validationResource="programRules/condition/description"
                                            programId={programId}
                                            type="default"
                                        />
                                    </PaddedContainer>
                                    <span className="helper-text">
                                        {i18n.t(
                                            'Expression to evaluate and assign.'
                                        )}
                                    </span>
                                </StandardFormField>
                            </>
                        )}

                    {/* CREATEEVENT */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.CREATEEVENT &&
                        programId && (
                            <StandardFormField>
                                <ModelSingleSelectFormField
                                    name="programStage"
                                    label={i18n.t('Program stage')}
                                    required
                                    query={{
                                        resource: 'programStages',
                                        params: {
                                            fields: ['id', 'displayName'],
                                            filter: `program.id:eq:${programId}`,
                                            paging: false,
                                        },
                                    }}
                                    inputWidth="400px"
                                    dataTest="program-rule-action-program-stage"
                                />
                            </StandardFormField>
                        )}

                    {/* SENDMESSAGE */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.SENDMESSAGE &&
                        programId && (
                            <StandardFormField>
                                <NotificationTemplateSelect
                                    programId={programId}
                                    required
                                />
                            </StandardFormField>
                        )}

                    {/* SCHEDULEMESSAGE */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType
                            .SCHEDULEMESSAGE &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <NotificationTemplateSelect
                                        programId={programId}
                                        required
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <PaddedContainer>
                                        <ExpressionBuilderEntry
                                            fieldName="data"
                                            title={i18n.t(
                                                'Edit date expression'
                                            )}
                                            editButtonText={i18n.t(
                                                'Edit expression'
                                            )}
                                            setUpButtonText={i18n.t(
                                                'Set up expression'
                                            )}
                                            validationResource="programRules/condition/description"
                                            clearable
                                            programId={programId}
                                            type="default"
                                        />
                                    </PaddedContainer>
                                    <span className="helper-text">
                                        {i18n.t('Date to send message.')}
                                    </span>
                                </StandardFormField>
                            </>
                        )}

                    {/* HIDEOPTION */}
                    {actionType ===
                        ProgramRuleAction.programRuleActionType.HIDEOPTION &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementWithOptionSetSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={i18n.t('Data element')}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeWithOptionSetSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={i18n.t(
                                            'Tracked entity attribute'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <OptionSelect
                                        optionSetId={optionSetIdFromOptionAction(
                                            values
                                        )}
                                        label={i18n.t('Option to hide')}
                                        required
                                    />
                                </StandardFormField>
                            </>
                        )}

                    {/* SHOWOPTIONGROUP, HIDEOPTIONGROUP */}
                    {(actionType ===
                        ProgramRuleAction.programRuleActionType
                            .SHOWOPTIONGROUP ||
                        actionType ===
                            ProgramRuleAction.programRuleActionType
                                .HIDEOPTIONGROUP) &&
                        programId && (
                            <>
                                <StandardFormField>
                                    <DataElementWithOptionSetSelect
                                        programId={programId}
                                        name="dataElement"
                                        label={i18n.t('Data element')}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <TrackedEntityAttributeWithOptionSetSelect
                                        programId={programId}
                                        name="trackedEntityAttribute"
                                        label={i18n.t(
                                            'Tracked entity attribute'
                                        )}
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <OptionGroupSelect
                                        optionSetId={optionSetIdFromOptionAction(
                                            values
                                        )}
                                        label={
                                            actionType ===
                                            ProgramRuleAction
                                                .programRuleActionType
                                                .SHOWOPTIONGROUP
                                                ? i18n.t('Option group to show')
                                                : i18n.t('Option group to hide')
                                        }
                                        required
                                    />
                                </StandardFormField>
                            </>
                        )}
                </SectionedFormSection>
            </SectionedFormLayout>
            <FormFooterWrapper>
                <ButtonStrip>
                    <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                    <Button primary type="submit">
                        {action ? i18n.t('Save action') : i18n.t('Add action')}
                    </Button>
                </ButtonStrip>
            </FormFooterWrapper>
            <SectionedFormErrorNotice />
        </form>
    )
}

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

function DataElementSelect({
    programId,
    name,
    label,
}: {
    programId: string
    name: string
    label: string
}) {
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageDataElements[dataElement[id,displayName]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageDataElements?: Array<{
                    dataElement: { id: string; displayName?: string }
                }>
            }>
        }>,
    })
    const elements = useMemo(() => {
        const list =
            data?.programStages?.flatMap(
                (s) =>
                    s.programStageDataElements?.map(
                        (psde) => psde.dataElement
                    ) ?? []
            ) ?? []
        const seen = new Set<string>()
        return list.filter((de) => {
            if (seen.has(de.id)) {
                return false
            }
            seen.add(de.id)
            return true
        })
    }, [data])
    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...elements.map((de) => ({
                value: de.id,
                label: de.displayName ?? de.id,
            })),
        ],
        [elements]
    )
    const disabled = !!(values as ProgramRuleActionFormValues)
        .trackedEntityAttribute?.id
    const { input, meta } = useField(name, {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? elements.find((e) => e.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('trackedEntityAttribute', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}

function TrackedEntityAttributeSelect({
    programId,
    name,
    label,
}: {
    programId: string
    name: string
    label: string
}) {
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: { id: string; displayName?: string }
            }>
        }>,
    })
    const attributes = useMemo(
        () =>
            data?.programTrackedEntityAttributes?.map(
                (pta) => pta.trackedEntityAttribute
            ) ?? [],
        [data]
    )
    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...attributes.map((a) => ({
                value: a.id,
                label: a.displayName ?? a.id,
            })),
        ],
        [attributes]
    )
    const disabled = !!(values as ProgramRuleActionFormValues).dataElement?.id
    const { input, meta } = useField(name, {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? attributes.find((a) => a.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('dataElement', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}

function DataElementWithOptionSetSelect({
    programId,
    name,
    label,
}: {
    programId: string
    name: string
    label: string
}) {
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageDataElements[dataElement[id,displayName,optionSet[id]]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageDataElements?: Array<{
                    dataElement: {
                        id: string
                        displayName?: string
                        optionSet?: { id: string }
                    }
                }>
            }>
        }>,
    })
    const elements = useMemo(() => {
        const list =
            data?.programStages?.flatMap(
                (s) =>
                    s.programStageDataElements?.map(
                        (psde) => psde.dataElement
                    ) ?? []
            ) ?? []
        const withOptionSet = list.filter((de) => de.optionSet?.id)
        const seen = new Set<string>()
        return withOptionSet.filter((de) => {
            if (seen.has(de.id)) {
                return false
            }
            seen.add(de.id)
            return true
        })
    }, [data])
    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...elements.map((de) => ({
                value: de.id,
                label: de.displayName ?? de.id,
            })),
        ],
        [elements]
    )
    const disabled = !!(values as ProgramRuleActionFormValues)
        .trackedEntityAttribute?.id
    const { input, meta } = useField(name, {
        format: (value: DataElementWithOptionSet | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? elements.find((e) => e.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('trackedEntityAttribute', undefined)
                            form.change('option', undefined)
                            form.change('optionGroup', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}

function TrackedEntityAttributeWithOptionSetSelect({
    programId,
    name,
    label,
}: {
    programId: string
    name: string
    label: string
}) {
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,optionSet[id]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: {
                    id: string
                    displayName?: string
                    optionSet?: { id: string }
                }
            }>
        }>,
    })
    const attributes = useMemo(() => {
        const list =
            data?.programTrackedEntityAttributes?.map(
                (pta) => pta.trackedEntityAttribute
            ) ?? []
        return list.filter((a) => a.optionSet?.id)
    }, [data])
    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...attributes.map((a) => ({
                value: a.id,
                label: a.displayName ?? a.id,
            })),
        ],
        [attributes]
    )
    const disabled = !!(values as ProgramRuleActionFormValues).dataElement?.id
    const { input, meta } = useField(name, {
        format: (value: TrackedEntityAttributeWithOptionSet | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? attributes.find((a) => a.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('dataElement', undefined)
                            form.change('option', undefined)
                            form.change('optionGroup', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}

function OptionSelect({
    optionSetId,
    label,
    required,
}: {
    optionSetId: string | undefined
    label: string
    required?: boolean
}) {
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'options',
                params: {
                    fields: ['id', 'displayName'],
                    filter: optionSetId
                        ? [`optionSet.id:eq:${optionSetId}`]
                        : undefined,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            options?: Array<{ id: string; displayName?: string }>
        }>,
        enabled: !!optionSetId,
    })
    const options = useMemo(() => data?.options ?? [], [data])
    const selectOptions = useMemo(
        () =>
            options.map((o) => ({ value: o.id, label: o.displayName ?? o.id })),
        [options]
    )
    const { input, meta } = useField('option', {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? options.find((o) => o.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                input as React.ComponentProps<
                    typeof SingleSelectFieldFF
                >['input']
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            disabled={!optionSetId}
            dataTest="program-rule-action-option"
            required={required}
            filterable
        />
    )
}

function OptionGroupSelect({
    optionSetId,
    label,
    required,
}: {
    optionSetId: string | undefined
    label: string
    required?: boolean
}) {
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'optionGroups',
                params: {
                    fields: ['id', 'displayName'],
                    filter: optionSetId
                        ? [`optionSet.id:eq:${optionSetId}`, 'name:neq:default']
                        : undefined,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            optionGroups?: Array<{ id: string; displayName?: string }>
        }>,
        enabled: !!optionSetId,
    })
    const optionGroups = useMemo(() => data?.optionGroups ?? [], [data])
    const selectOptions = useMemo(
        () =>
            optionGroups.map((og) => ({
                value: og.id,
                label: og.displayName ?? og.id,
            })),
        [optionGroups]
    )
    const { input, meta } = useField('optionGroup', {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? optionGroups.find((og) => og.id === id) : undefined,
    })
    return (
        <SingleSelectFieldFF
            input={
                input as React.ComponentProps<
                    typeof SingleSelectFieldFF
                >['input']
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            disabled={!optionSetId}
            dataTest="program-rule-action-option-group"
            required={required}
            filterable
        />
    )
}

function ProgramStageSectionSelect({
    programId,
    label,
}: {
    programId: string
    label: string
}) {
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageSections[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageSections?: Array<{
                    id: string
                    displayName?: string
                }>
            }>
        }>,
    })
    const sections = useMemo(() => {
        const list =
            data?.programStages?.flatMap((s) => s.programStageSections ?? []) ??
            []
        const seen = new Set<string>()
        return list.filter((s) => {
            if (seen.has(s.id)) {
                return false
            }
            seen.add(s.id)
            return true
        })
    }, [data])
    const selectOptions = useMemo(
        () =>
            sections.map((s) => ({
                value: s.id,
                label: s.displayName ?? s.id,
            })),
        [sections]
    )
    return (
        <Field
            name="programStageSection"
            label={label}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            required
            dataTest="program-rule-action-program-stage-section"
            filterable
        />
    )
}

function ProgramRuleVariableSelect({ programId }: { programId: string }) {
    const queryFn = useBoundResourceQueryFn()
    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programRuleVariables',
                params: {
                    fields: ['id', 'displayName'],
                    filter: `program.id:eq:${programId}`,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programRuleVariables?: Array<{ id: string; displayName?: string }>
        }>,
    })
    const variables = useMemo(() => data?.programRuleVariables ?? [], [data])
    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...variables.map((v) => ({
                value: v.id,
                label: v.displayName ?? v.id,
            })),
        ],
        [variables]
    )
    return (
        <Field
            name="content"
            label={i18n.t('Program rule variable to assign to')}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            dataTest="program-rule-action-program-rule-variable"
            format={(value: string | undefined) => value ?? ''}
            parse={(id: string) => id || undefined}
            filterable
        />
    )
}

function NotificationTemplateSelect({
    programId,
    required,
}: {
    programId: string
    required?: boolean
}) {
    const queryFn = useBoundResourceQueryFn()
    const { data: programData } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'notificationTemplates[id,displayName]',
                        'programStages[notificationTemplates[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            notificationTemplates?: Array<{ id: string; displayName?: string }>
            programStages?: Array<{
                notificationTemplates?: Array<{
                    id: string
                    displayName?: string
                }>
            }>
        }>,
    })
    const options = useMemo(() => {
        const fromProgram = programData?.notificationTemplates ?? []
        const fromStages =
            programData?.programStages?.flatMap(
                (s) => s.notificationTemplates ?? []
            ) ?? []
        const all = [...fromProgram, ...fromStages]
        const seen = new Set<string>()
        return all.filter((t) => {
            if (seen.has(t.id)) {
                return false
            }
            seen.add(t.id)
            return true
        })
    }, [programData])
    const selectOptions = useMemo(
        () =>
            options.map((t) => ({ value: t.id, label: t.displayName ?? t.id })),
        [options]
    )
    return (
        <Field
            name="templateUid"
            label={i18n.t('Message template')}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            required={required}
            dataTest="program-rule-action-notification-template"
            filterable
        />
    )
}
