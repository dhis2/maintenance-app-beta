import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import { FORM_ERROR } from 'final-form'
import { useMemo } from 'react'
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

/**
 * Submit hooks for forms with group membership. Strips the groups field from
 * the save payload and syncs membership changes via dedicated POST/DELETE
 * endpoints after the base save succeeds. On group sync failure, a critical
 * alert is shown and the form remains open for retry.
 */

type GroupRef = { id: string }

const diffGroupIds = (next: GroupRef[] = [], prev: GroupRef[] = []) => {
    const prevIds = new Set(prev.map((g) => g.id))
    const nextIds = new Set(next.map((g) => g.id))
    const added = [...nextIds].filter((id) => !prevIds.has(id))
    const removed = [...prevIds].filter((id) => !nextIds.has(id))
    return { added, removed }
}

type UseOnSubmitEditWithGroupsOptions = {
    section: ModelSection
    modelId: string
    groupResource: string
}

export const useOnSubmitEditWithGroups = <
    TFormValues extends IdentifiableObject
>({
    section,
    modelId,
    groupResource,
}: UseOnSubmitEditWithGroupsOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(section)
    const syncGroupMembership = useSyncGroupMembership({
        resource: section.namePlural,
        groupResource,
    })
    const groupSyncFailureAlert = useAlert(({ message }) => message, {
        critical: true,
    })

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, form, options) => {
            const formState = form.getState()
            const dirtyFields = { ...formState.dirtyFields }
            const initialValues =
                (formState.initialValues as Record<string, unknown>) ?? {}

            const groupsDirty = !!dirtyFields[groupResource]
            delete dirtyFields[groupResource]
            const valuesForPatch = (() => {
                const copy = { ...values } as Record<string, unknown>
                delete copy[groupResource]
                return copy as TFormValues
            })()

            const jsonPatchOperations = createJsonPatchOperations({
                values: valuesForPatch,
                dirtyFields,
                originalValue: initialValues,
            })

            const navigateTo =
                options?.navigateTo === undefined
                    ? defaultNavigateTo
                    : options.navigateTo

            let withChanges = false
            let response: Awaited<ReturnType<typeof patchDirtyFields>> | null =
                null
            if (jsonPatchOperations.length > 0) {
                response = await patchDirtyFields(jsonPatchOperations)
                if (response.error) {
                    return createFormError(response.error)
                }
                withChanges = true
            }

            if (groupsDirty) {
                const next = (values as Record<string, unknown>)[
                    groupResource
                ] as GroupRef[] | undefined
                const prev = initialValues[groupResource] as
                    | GroupRef[]
                    | undefined
                const { added, removed } = diffGroupIds(next, prev)
                if (added.length > 0 || removed.length > 0) {
                    const outcome = await syncGroupMembership({
                        modelId,
                        added,
                        removed,
                    })
                    if (!outcome.ok) {
                        groupSyncFailureAlert.show({
                            message: i18n.t(
                                'Saved successfully, but failed to update groups'
                            ),
                        })
                        return {
                            [FORM_ERROR]: i18n.t(
                                'Saved successfully, but failed to update groups'
                            ),
                        }
                    }
                    withChanges = true
                }
            }

            onEditCompletedSuccessfully({
                withChanges,
                response,
                navigateTo,
                submitAction: options?.submitAction,
            })
            return undefined
        },
        [
            patchDirtyFields,
            onEditCompletedSuccessfully,
            syncGroupMembership,
            groupSyncFailureAlert,
            modelId,
            groupResource,
        ]
    )
}

type UseOnSubmitNewWithGroupsOptions = {
    section: ModelSection
    groupResource: string
}

export const useOnSubmitNewWithGroups = <
    TFormValues extends Record<string, unknown>
>({
    section,
    groupResource,
}: UseOnSubmitNewWithGroupsOptions) => {
    const createModel = useCreateModel(section.namePlural)
    const syncGroupMembership = useSyncGroupMembership({
        resource: section.namePlural,
        groupResource,
    })
    const queryClient = useQueryClient()
    const navigate = useNavigateWithSearchState()
    const [searchParams] = useSearchParams()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const groupSyncFailureAlert = useAlert(({ message }) => message, {
        critical: true,
    })

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, _form, options) => {
            if (!values) {
                console.error('Tried to save new object without any changes', {
                    values,
                })
                saveAlert.show({
                    message: i18n.t('Cannot save empty object'),
                    error: true,
                })
                return
            }

            const selectedGroups =
                ((values as Record<string, unknown>)[groupResource] as
                    | GroupRef[]
                    | undefined) ?? []
            const valuesForCreate = (() => {
                const copy = { ...values } as Record<string, unknown>
                delete copy[groupResource]
                return copy
            })()

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
                const outcome = await syncGroupMembership({
                    modelId: newId,
                    added: selectedGroups.map((g) => g.id),
                    removed: [],
                })
                if (!outcome.ok) {
                    groupSyncFailureAlert.show({
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
            syncGroupMembership,
            queryClient,
            navigate,
            searchParams,
            saveAlert,
            groupSyncFailureAlert,
            section,
            groupResource,
        ]
    )
}
