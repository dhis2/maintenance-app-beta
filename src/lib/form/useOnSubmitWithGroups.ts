import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import { FORM_ERROR } from 'final-form'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ModelSection } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { useNavigateWithSearchState } from '../routeUtils'
import { createFormError } from './createFormError'
import { createJsonPatchOperations } from './createJsonPatchOperations'
import { useCreateModel } from './useCreateModel'
import {
    defaultNavigateTo,
    EnhancedOnSubmit,
    useOnEditCompletedSuccessfully,
} from './useOnSubmit'
import { usePatchModel } from './usePatchModel'
import { useSyncGroupMembership } from './useSyncGroupMembership'

type GroupRef = { id: string }

const diffGroupIds = (next: GroupRef[] = [], prev: GroupRef[] = []) => {
    const prevIds = new Set(prev.map((g) => g.id))
    const nextIds = new Set(next.map((g) => g.id))
    const added = [...nextIds].filter((id) => !prevIds.has(id))
    const removed = [...prevIds].filter((id) => !nextIds.has(id))
    return { added, removed }
}

type EditOptions = {
    section: ModelSection
    modelId: string
    groupsFieldName: string
    groupResource: string
}

export const useOnSubmitEditWithGroups = <
    TFormValues extends IdentifiableObject
>({
    section,
    modelId,
    groupsFieldName,
    groupResource,
}: EditOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(section)
    const { sync } = useSyncGroupMembership({
        resource: section.namePlural,
        groupResource,
    })
    const partialFailureAlert = useAlert(
        ({ message }: { message: string }) => message,
        { critical: true }
    )

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, form, options) => {
            const formState = form.getState()
            const dirtyFields = { ...formState.dirtyFields }
            const initialValues =
                (formState.initialValues as Record<string, unknown>) ?? {}

            // Strip the groups field from JSON-PATCH input — group membership
            // is managed via dedicated POST/DELETE endpoints, not via PATCH.
            const groupsDirty = !!dirtyFields[groupsFieldName]
            delete dirtyFields[groupsFieldName]
            const valuesForPatch = { ...values } as Record<string, unknown>
            delete valuesForPatch[groupsFieldName]

            const navigateTo =
                options?.navigateTo === undefined
                    ? defaultNavigateTo
                    : options.navigateTo

            const jsonPatchOperations = createJsonPatchOperations({
                values: valuesForPatch as TFormValues,
                dirtyFields,
                originalValue: initialValues,
            })

            let baseSaveHappened = false
            if (jsonPatchOperations.length > 0) {
                const response = await patchDirtyFields(jsonPatchOperations)
                if (response.error) {
                    return createFormError(response.error)
                }
                baseSaveHappened = true
            }

            if (groupsDirty) {
                const next = values[groupsFieldName as keyof typeof values] as
                    | GroupRef[]
                    | undefined
                const prev = initialValues[groupsFieldName] as
                    | GroupRef[]
                    | undefined
                const { added, removed } = diffGroupIds(next, prev)

                if (added.length > 0 || removed.length > 0) {
                    const outcome = await sync({ modelId, added, removed })
                    if (!outcome.ok) {
                        partialFailureAlert.show({
                            message: i18n.t(
                                'Saved successfully, but failed to update groups'
                            ),
                        })
                        // Return a form error so navigation/exit is suppressed.
                        return {
                            [FORM_ERROR]: i18n.t(
                                'Saved successfully, but failed to update groups'
                            ),
                        }
                    }
                    baseSaveHappened = true
                }
            }

            onEditCompletedSuccessfully({
                withChanges: baseSaveHappened,
                response: null,
                navigateTo,
                submitAction: options?.submitAction,
            })
            return undefined
        },
        [
            patchDirtyFields,
            onEditCompletedSuccessfully,
            sync,
            partialFailureAlert,
            modelId,
            groupsFieldName,
        ]
    )
}

type NewOptions = {
    section: ModelSection
    groupsFieldName: string
    groupResource: string
}

export const useOnSubmitNewWithGroups = <
    TFormValues extends Record<string, unknown>
>({
    section,
    groupsFieldName,
    groupResource,
}: NewOptions) => {
    const createModel = useCreateModel(section.namePlural)
    const { sync } = useSyncGroupMembership({
        resource: section.namePlural,
        groupResource,
    })
    const queryClient = useQueryClient()
    const navigate = useNavigateWithSearchState()
    const [searchParams] = useSearchParams()
    const saveAlert = useAlert(
        ({ message }: { message: string }) => message,
        (alertOptions) => alertOptions
    )
    const partialFailureAlert = useAlert(
        ({ message }: { message: string }) => message,
        { critical: true }
    )

    return useCallback<EnhancedOnSubmit<TFormValues>>(
        async (values, _form, options) => {
            if (!values) {
                saveAlert.show({
                    message: i18n.t('Cannot save empty object'),
                    error: true,
                })
                return
            }

            const selectedGroups =
                ((values as Record<string, unknown>)[groupsFieldName] as
                    | GroupRef[]
                    | undefined) ?? []
            const valuesForCreate = { ...values } as Record<string, unknown>
            delete valuesForCreate[groupsFieldName]

            const response = await createModel(valuesForCreate)
            if (response.error) {
                return createFormError(response.error)
            }

            const responseData = response.data as
                | { response?: { uid?: string; id?: string } }
                | undefined
            const newId =
                responseData?.response?.uid ?? responseData?.response?.id

            if (selectedGroups.length > 0 && newId) {
                const outcome = await sync({
                    modelId: newId,
                    added: selectedGroups.map((g) => g.id),
                    removed: [],
                })
                if (!outcome.ok) {
                    partialFailureAlert.show({
                        message: i18n.t(
                            'Created successfully, but failed to update groups'
                        ),
                    })
                    queryClient.invalidateQueries({
                        queryKey: [{ resource: section.namePlural }],
                    })
                    const currentSearch = searchParams.toString()
                        ? `?${searchParams.toString()}`
                        : ''
                    navigate({
                        pathname: `/${section.namePlural}/${newId}`,
                        search: currentSearch,
                    })
                    return {
                        [FORM_ERROR]: i18n.t(
                            'Created successfully, but failed to update groups'
                        ),
                    }
                }
            }

            saveAlert.show({
                message: i18n.t('Created successfully'),
                success: true,
            })
            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })

            const navigateTo =
                options?.navigateTo === undefined
                    ? defaultNavigateTo
                    : options.navigateTo
            if (navigateTo) {
                const navTo = navigateTo({
                    section,
                    submitAction: options?.submitAction,
                    responseData: response.data,
                    searchParams,
                })
                if (navTo) {
                    navigate(navTo)
                }
            }
            return response
        },
        [
            createModel,
            sync,
            queryClient,
            navigate,
            searchParams,
            saveAlert,
            partialFailureAlert,
            section,
            groupsFieldName,
        ]
    )
}
