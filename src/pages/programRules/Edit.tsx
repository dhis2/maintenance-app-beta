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
            // Exclude new-* ids so we only call delete for actions that exist on the server.
            const actionsToDelete = actions.filter(
                (a) => a.deleted && a.id && !a.id.startsWith('new-')
            )
            const deletionResults = await Promise.allSettled(
                actionsToDelete.map((a) =>
                    dataEngine.mutate({
                        resource: 'programRuleActions',
                        id: a.id,
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
                // Invalidate so UI doesn't show stale data after partial delete failures
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programRules' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error deleting program rule actions'
                    ),
                    errors: failures.map(
                        (f) =>
                            (f as PromiseRejectedResult).reason?.message ?? ''
                    ),
                })
            }

            // Strip deleted actions from payload before saving the program rule
            const trimmedValues = {
                ...values,
                programRuleActions: actions.filter((a) => !a.deleted),
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
