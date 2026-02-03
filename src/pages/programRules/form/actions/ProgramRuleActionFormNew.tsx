/**
 * Program rule action form (drawer). Fields vary by action type (SHOWWARNING,
 * HIDEFIELD, ASSIGN, etc.). Used for add and edit; submitted values are merged
 * into the parent form's programRuleActions array.
 */
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    InputFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field, useFormState } from 'react-final-form'
import {
    ExpressionBuilderEntry,
    FormBase,
    SectionedFormLayout,
    SectionedFormSection,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { PaddedContainer } from '../../../../components/ExpressionBuilder/PaddedContainer'
import { ModelSingleSelectFormField } from '../../../../components/metadataFormControls/ModelSingleSelect'
import { ProgramRuleAction } from '../../../../types/generated'
import { PriorityField } from '../../fields/PriorityField'
import {
    createInitialValuesNew,
    DISPLAY_WIDGET_LOCATION_OPTIONS,
    normalizeLocation,
} from './constants'
import {
    DataElementSelect,
    DataElementWithOptionSetSelect,
    NotificationTemplateSelect,
    OptionGroupSelect,
    OptionSelect,
    ProgramRuleVariableSelect,
    ProgramStageSectionSelect,
    TrackedEntityAttributeSelect,
    TrackedEntityAttributeWithOptionSetSelect,
} from './fields'
import { optionSetIdFromFormValues } from './fieldTypes'
import drawerStyles from './ProgramRuleActionForm.module.css'
import { PROGRAM_RULE_ACTION_TYPE_OPTIONS } from './programRuleActionTypeConstants'
import type { ProgramRuleActionListItem } from './types'
import { validateProgramRuleAction } from './validation'

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
    const initialValues = action
        ? {
              ...action,
              location: normalizeLocation(action.location),
              programRule: { id: programRuleId },
          }
        : createInitialValuesNew(programRuleId)

    return (
        <FormBase
            onSubmit={(values) => {
                // Strip programRule object so payload matches API (API expects programRule as ref, not nested)
                const { programRule, ...rest } = values
                onSubmitted(rest as ProgramRuleActionListItem)
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
}: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
}) {
    const { values } = useFormState({ subscription: { values: true } })
    const actionType = values.programRuleActionType as string | undefined

    return (
        <form onSubmit={handleSubmit} className={drawerStyles.drawerForm}>
            <div className={drawerStyles.drawerFormBody}>
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
                                options={PROGRAM_RULE_ACTION_TYPE_OPTIONS}
                                dataTest="program-rule-action-type"
                                required
                            />
                        </StandardFormField>

                        {/* DISPLAYTEXT */}
                        {actionType ===
                            ProgramRuleAction.programRuleActionType
                                .DISPLAYTEXT && (
                            <>
                                <StandardFormField>
                                    <Field
                                        name="location"
                                        label={i18n.t('Display widget')}
                                        component={SingleSelectFieldFF}
                                        options={
                                            DISPLAY_WIDGET_LOCATION_OPTIONS
                                        }
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
                                    <span className={drawerStyles.helperText}>
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
                                        options={
                                            DISPLAY_WIDGET_LOCATION_OPTIONS
                                        }
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
                                    <span className={drawerStyles.helperText}>
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
                                            label={i18n.t(
                                                'Data element to hide'
                                            )}
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
                            ProgramRuleAction.programRuleActionType
                                .HIDESECTION &&
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

                        {/* SHOWWARNING, SHOWERROR, WARNINGONCOMPLETE, ERRORONCOMPLETE */}
                        {(actionType ===
                            ProgramRuleAction.programRuleActionType
                                .SHOWWARNING ||
                            actionType ===
                                ProgramRuleAction.programRuleActionType
                                    .SHOWERROR ||
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
                                                title={i18n.t(
                                                    'Edit expression'
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
                                        <span
                                            className={drawerStyles.helperText}
                                        >
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
                                                title={i18n.t(
                                                    'Edit expression'
                                                )}
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
                                        <span
                                            className={drawerStyles.helperText}
                                        >
                                            {i18n.t(
                                                'Expression to evaluate and assign.'
                                            )}
                                        </span>
                                    </StandardFormField>
                                </>
                            )}

                        {/* CREATEEVENT */}
                        {actionType ===
                            ProgramRuleAction.programRuleActionType
                                .CREATEEVENT &&
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
                            ProgramRuleAction.programRuleActionType
                                .SENDMESSAGE &&
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
                                        <span
                                            className={drawerStyles.helperText}
                                        >
                                            {i18n.t('Date to send message.')}
                                        </span>
                                    </StandardFormField>
                                </>
                            )}

                        {/* HIDEOPTION */}
                        {actionType ===
                            ProgramRuleAction.programRuleActionType
                                .HIDEOPTION &&
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
                                            optionSetId={optionSetIdFromFormValues(
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
                                            optionSetId={optionSetIdFromFormValues(
                                                values
                                            )}
                                            label={
                                                actionType ===
                                                ProgramRuleAction
                                                    .programRuleActionType
                                                    .SHOWOPTIONGROUP
                                                    ? i18n.t(
                                                          'Option group to show'
                                                      )
                                                    : i18n.t(
                                                          'Option group to hide'
                                                      )
                                            }
                                            required
                                        />
                                    </StandardFormField>
                                </>
                            )}

                        {/* PRIORITY - Placed last as requested */}
                        <StandardFormField>
                            <PriorityField />
                        </StandardFormField>
                    </SectionedFormSection>
                </SectionedFormLayout>
            </div>
            <div className={drawerStyles.drawerFormFooter}>
                <ButtonStrip>
                    <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
                    <Button primary type="submit">
                        {action ? i18n.t('Save action') : i18n.t('Add action')}
                    </Button>
                </ButtonStrip>
            </div>
        </form>
    )
}
