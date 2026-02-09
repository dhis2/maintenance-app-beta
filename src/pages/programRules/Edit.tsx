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
import type { ProgramRuleActionListItem } from './form/actions/types'
import { fieldFilters, ProgramRuleFormValues } from './form/fieldFilters'
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { validate } from './form/programRuleSchema'

/** Form values type including programRuleActions array (used by submit handler). */
type ProgramRuleFormValuesWithActions = ProgramRuleFormValues & {
    programRuleActions?: ProgramRuleActionListItem[]
}

/** Returns a copy of obj with undefined, null and empty string values removed (backend rejects them). */
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

/** Strips frontend-only fields (deleted, and id for new actions) and empty values for API payload. */
function cleanActionForSubmit(
    action: ProgramRuleActionListItem,
    originalActions: ProgramRuleActionListItem[]
): Record<string, unknown> {
    const isExisting =
        action.id && originalActions.some((orig) => orig.id === action.id)
    const { deleted, ...rest } = action
    const cleanAction = isExisting ? rest : (({ id: _id, ...r }) => r)(rest)
    return removeEmptyFields(cleanAction)
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
            // Current actions from form (including soft-deleted)
            const actions: ProgramRuleActionListItem[] =
                values.programRuleActions ?? []
            // Only delete actions that exist on server (have id)
            const actionsToDelete = actions.filter(
                (a: ProgramRuleActionListItem) => a.deleted && a.id
            )
            // Delete soft-deleted actions from API
            const deletionResults = await Promise.allSettled(
                actionsToDelete.map((a: ProgramRuleActionListItem) =>
                    dataEngine.mutate({
                        resource: 'programRuleActions',
                        id: a.id!,
                        type: 'delete',
                    })
                )
            )

            const rejected = deletionResults.filter(
                (r) => r.status === 'rejected'
            )
            if (rejected.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programRules' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error deleting program rule actions'
                    ),
                    errors: rejected.map(
                        (r) =>
                            (r as PromiseRejectedResult).reason?.message ?? ''
                    ),
                })
            }

            // Original actions (from initial load) to distinguish new vs existing
            const originalActions: ProgramRuleActionListItem[] =
                form.getState().initialValues.programRuleActions ?? []
            // Drop deleted, clean each action for API
            const trimmedValues = {
                ...values,
                programRuleActions: actions
                    .filter((a: ProgramRuleActionListItem) => !a.deleted)
                    .map((a) => cleanActionForSubmit(a, originalActions)),
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
        params: { fields: fieldFilters.concat() },
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
        >
            {({ handleSubmit }) => (
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
            )}
        </FormBase>
    )
}
