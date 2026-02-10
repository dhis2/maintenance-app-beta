import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { FormApi } from 'final-form'
import arrayMutators from 'final-form-arrays'
import React, { useCallback } from 'react'
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
import type { ProgramRuleActionListItem } from './form/actions/types'
import { fieldFilters, ProgramRuleFormValues } from './form/fieldFilters'
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { validate } from './form/programRuleSchema'

function cleanActionForApi(
    action: ProgramRuleActionListItem,
    existingIds: Set<string>
): Record<string, unknown> {
    const { id, ...rest } = action
    const payload = existingIds.has(id) ? { ...rest, id } : rest
    return Object.fromEntries(
        Object.entries(payload).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
        )
    )
}

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.programRule
    const queryFn = useBoundResourceQueryFn()
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const submitEdit = useOnSubmitEdit({ section, modelId })

    const query = {
        resource: 'programRules',
        id: modelId,
        params: { fields: [...fieldFilters] },
    }
    const { data: initialValues } = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleFormValues>,
    })

    const onSubmit = useCallback(
        async (
            values: ProgramRuleFormValues & {
                programRuleActions?: ProgramRuleActionListItem[]
            },
            form: FormApi<ProgramRuleFormValues>,
            options?: Parameters<typeof submitEdit>[2]
        ) => {
            const actions = (values.programRuleActions ??
                []) as ProgramRuleActionListItem[]
            const toDelete = actions.filter((a) => a.deleted && a.id)

            try {
                for (const a of toDelete) {
                    await dataEngine.mutate({
                        resource: 'programRuleActions',
                        id: a.id!,
                        type: 'delete',
                    })
                }
            } catch (err) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programRules' }],
                })
                return createFormError({
                    message: i18n.t(
                        'There was an error deleting program rule actions'
                    ),
                    errors: [err instanceof Error ? err.message : String(err)],
                })
            }

            const initial = (form.getState().initialValues.programRuleActions ??
                []) as ProgramRuleActionListItem[]
            const existingIds = new Set(
                initial.map((a) => a.id).filter(Boolean)
            )
            const kept = actions.filter((a) => !a.deleted)
            const prepared: ProgramRuleFormValues = {
                ...values,
                programRuleActions: kept.map((a) =>
                    cleanActionForApi(a, existingIds)
                ),
            } as ProgramRuleFormValues

            return submitEdit(
                prepared,
                form as unknown as Parameters<typeof submitEdit>[1],
                options
            )
        },
        [submitEdit, dataEngine, queryClient]
    )

    return (
        <FormBase
            onSubmit={onSubmit}
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
