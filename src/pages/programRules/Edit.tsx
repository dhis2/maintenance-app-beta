import { useDataEngine } from '@dhis2/app-runtime'
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
    createJsonPatchOperations,
    createFormError,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    usePatchModel,
    useOnEditCompletedSuccessfully,
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
    const patchModel = usePatchModel(modelId, section.namePlural)
    const onEditCompleted = useOnEditCompletedSuccessfully(section)
    const dataEngine = useDataEngine()

    const onSubmit = useCallback(
        async (
            values: ProgramRuleFormValues,
            form: FormApi<ProgramRuleFormValues>,
            options?: { submitAction?: string }
        ) => {
            const actions = values.programRuleActions as
                | ProgramRuleActionListItem[]
                | undefined

            const deletedActions =
                actions?.filter((a) => a.deleted && a.id) || []
            for (const action of deletedActions) {
                try {
                    await dataEngine.mutate({
                        resource: 'programRuleActions',
                        id: action.id,
                        type: 'delete',
                    })
                } catch (error) {
                    return createFormError(error)
                }
            }

            const dirtyFields = Object.fromEntries(
                Object.entries(form.getState().dirtyFields).filter(
                    ([key]) => !key.startsWith('programRuleActions')
                )
            )

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { programRuleActions, ...valuesWithoutActions } = values

            const jsonPatchOperations = createJsonPatchOperations({
                values: valuesWithoutActions,
                dirtyFields,
                originalValue: form.getState().initialValues,
            })

            if (jsonPatchOperations.length > 0) {
                const response = await patchModel(jsonPatchOperations)
                if (response.error) {
                    return createFormError(response.error)
                }
            }

            const hasChanges =
                jsonPatchOperations.length > 0 || deletedActions.length > 0
            onEditCompleted({
                withChanges: hasChanges,
                submitAction:
                    (options?.submitAction as 'save' | 'saveAndExit') ??
                    'saveAndExit',
            })
        },
        [patchModel, onEditCompleted, dataEngine]
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
