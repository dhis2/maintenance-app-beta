/**
 * Program rule edit page.
 * Renders a sectioned form (Basic information, Expression, Actions) and on submit
 * deletes any soft-deleted program rule actions before saving the rule.
 */
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    DrawerRoot,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import {
    createFormError,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import type { ProgramRuleActionListItem } from './form/actions/ProgramRuleActionsFormContents'
import { fieldFilters, ProgramRuleFormValues } from './form/fieldFilters'
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { validate } from './form/programRuleSchema'

/** Extends form values so submit handler can read programRuleActions from form state. */
type ProgramRuleFormValuesWithActions = ProgramRuleFormValues & {
    programRuleActions?: ProgramRuleActionListItem[]
}

/** Remove undefined/null/empty fields (backend doesn't like null refs). */
function removeEmptyFields(
    obj: Record<string, unknown>
): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {}
    for (const key of Object.keys(obj)) {
        const value = obj[key]
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key] = value
        }
    }
    return cleaned
}

function getDeletionFailureMessages(
    failures: Array<{ status: string } & { reason?: { message?: string } }>
): string[] {
    return failures.map(
        (f) => (f as PromiseRejectedResult).reason?.message ?? ''
    )
}

/** Map a single action to API payload: strip frontend-only fields and empty values. */
function cleanActionForSubmit(
    action: ProgramRuleActionListItem,
    originalActions: ProgramRuleActionListItem[]
): Record<string, unknown> {
    const isExisting =
        action.id &&
        originalActions.some(
            (orig: ProgramRuleActionListItem) => orig.id === action.id
        )
    if (isExisting) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { deleted, ...cleanAction } = action
        return removeEmptyFields(cleanAction) as Record<string, unknown>
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, deleted, ...cleanAction } = action
    return removeEmptyFields(cleanAction) as Record<string, unknown>
}

/**
 * Custom submit handler: deletes actions marked as deleted (soft-delete), then
 * submits the program rule with the remaining actions.
 */
const useOnSubmitProgramRuleEdit = (modelId: string) => {
    const submitEdit = useOnSubmitEdit({
        section: SECTIONS_MAP.programRule,
        modelId,
    })
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()

    return useMemo<EnhancedOnSubmit<ProgramRuleFormValuesWithActions>>(
        () => async (values, form, options) => {
            const formValues = form.getState().values
            const actions: ProgramRuleActionListItem[] =
                formValues.programRuleActions ?? []

            // Delete from API any persisted actions that were soft-deleted in the UI.
            // Only delete actions that have an id (exist on server)
            const actionsToDelete = actions.filter((a) => a.deleted && a.id)
            const deletionResults = await Promise.allSettled(
                actionsToDelete.map((a) =>
                    dataEngine.mutate({
                        resource: 'programRuleActions',
                        id: a.id!, // Non-null assertion OK because filter above ensures id exists
                        type: 'delete',
                    })
                )
            )

            const failures = deletionResults
                .map((result, i) => ({
                    ...result,
                    actionId: actionsToDelete[i]?.id,
                }))
                .filter((r) => r.status === 'rejected')

            if (failures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programRules' }],
                })
                const errorMessages = getDeletionFailureMessages(failures)
                return createFormError({
                    message: i18n.t(
                        'There was an error deleting program rule actions'
                    ),
                    errors: errorMessages,
                })
            }

            // Strip deleted actions and clean data for API
            const originalActions =
                form.getState().initialValues.programRuleActions ?? []

            const trimmedValues = {
                ...values,
                programRuleActions: actions
                    .filter((a) => !a.deleted)
                    .map((action) =>
                        cleanActionForSubmit(action, originalActions)
                    ),
            }

            return submitEdit(
                trimmedValues as ProgramRuleFormValues,
                form as unknown as Parameters<typeof submitEdit>[1],
                options
            )
        },
        [submitEdit, dataEngine, queryClient]
    )
}

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.programRule
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'programRules',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const programRuleQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleFormValues>,
    })

    const initialValues = programRuleQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitProgramRuleEdit(modelId)}
            initialValues={initialValues}
            modelName={section.name}
            includeAttributes={false}
            validate={validate}
            subscription={{}}
            mutators={{ ...arrayMutators }}
            /* arrayMutators needed for useFieldArray('programRuleActions') in ProgramRuleActionsFormContents */
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramRuleFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <DrawerRoot />
                            <form onSubmit={handleSubmit}>
                                <ProgramRuleFormFields />
                                <DefaultFormFooter cancelTo="/programRules" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
