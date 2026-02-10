import { useQuery } from '@tanstack/react-query'
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

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.programRule
    const queryFn = useBoundResourceQueryFn()
    const submitEdit = useOnSubmitEdit({ section, modelId })

    const onSubmit = useCallback(
        (
            values: ProgramRuleFormValues,
            form: FormApi<ProgramRuleFormValues>,
            options?: any
        ) => {
            const actions = values.programRuleActions as
                | ProgramRuleActionListItem[]
                | undefined
            const initialActions = form.getState().initialValues
                .programRuleActions as ProgramRuleActionListItem[] | undefined
            const existingIds = new Set(
                initialActions?.map((a) => a.id).filter(Boolean) || []
            )

            const cleanedActions =
                actions
                    ?.filter((action) => !action.deleted)
                    .map((action) => {
                        const cleaned = Object.fromEntries(
                            Object.entries(action).filter(([key, value]) => {
                                if (key === 'deleted') {
                                    return false
                                }
                                return (
                                    value !== undefined &&
                                    value !== null &&
                                    value !== ''
                                )
                            })
                        )
                        if (!existingIds.has(action.id)) {
                            delete cleaned.id
                        }
                        return cleaned
                    }) || []

            const filteredValues = {
                ...values,
                programRuleActions: cleanedActions,
            }
            return submitEdit(filteredValues, form as any, options)
        },
        [submitEdit]
    )

    const query = {
        resource: 'programRules',
        id: modelId,
        params: { fields: [...fieldFilters] },
    }
    const { data: initialValues } = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleFormValues>,
    })

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
