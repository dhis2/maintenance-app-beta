import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import { FORM_ERROR, FormApi, SubmissionErrors } from 'final-form'
import { useCallback, useMemo } from 'react'
import { To, useSearchParams } from 'react-router-dom'
import { ModelSection } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { getSectionPath, useNavigateWithSearchState } from '../routeUtils'
import { createFormError } from './createFormError'
import {
    createJsonPatchOperations,
    ModelWithAttributeValues,
} from './createJsonPatchOperations'
import { useCreateModel } from './useCreateModel'
import { usePatchModel } from './usePatchModel'
import { useSyncGroupMembership } from './useSyncGroupMembership'

export type SubmitAction = 'save' | 'saveAndExit'

export type GetToFunction = (options: {
    section: ModelSection
    submitAction?: SubmitAction
    responseData?: unknown
    searchParams?: URLSearchParams
}) => To | undefined

interface Navigateable {
    navigateTo?: GetToFunction | null
}

/*
    Enhance FinalForms onSubmit function to include some additional options.
    Note that compared to final-forms onSubmit the 'callback' parameter is replaced with an options object.
*/
export type EnhancedOnSubmit<TValues> = (
    values: TValues,
    form: FormApi<TValues>,
    options?: Navigateable & {
        submitAction?: SubmitAction
    }
) => SubmissionErrors | Promise<SubmissionErrors> | void

/*
    When set, group membership is managed via dedicated POST/DELETE endpoints
    after the base save (PATCH or POST). The form field with this name is
    stripped from the JSON-PATCH / create payload, and the new/removed group
    IDs are diffed against the initial values and synced individually.
*/
export type GroupsConfig = {
    resource: string
}

type GroupRef = { id: string }

const diffGroupIds = (next: GroupRef[] = [], prev: GroupRef[] = []) => {
    const prevIds = new Set(prev.map((g) => g.id))
    const nextIds = new Set(next.map((g) => g.id))
    const added = [...nextIds].filter((id) => !prevIds.has(id))
    const removed = [...prevIds].filter((id) => !nextIds.has(id))
    return { added, removed }
}

export const defaultNavigateTo: GetToFunction = ({
    section,
    submitAction = 'saveAndExit',
    responseData,
    searchParams,
}) => {
    const currentSearch =
        searchParams && searchParams.toString()
            ? `?${searchParams.toString()}`
            : ''

    if (submitAction === 'saveAndExit') {
        return `/${getSectionPath(section)}`
    }

    if (submitAction === 'save') {
        // check if we created a model - if so navigate to that form when saving
        if (
            responseData &&
            typeof responseData === 'object' &&
            'httpStatusCode' in responseData &&
            responseData.httpStatusCode === 201 &&
            'response' in responseData
        ) {
            const id =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (responseData as any).response.id ||
                (responseData as any).response.uid
            if (!id) {
                console.error(
                    'No id or uid found in response data for navigateTo function',
                    responseData
                )
                return undefined
            }

            return {
                pathname: `/${getSectionPath(section)}/${id}`,
                search: currentSearch,
            }
        }
        // if it's not a creation (eg. we edit), dont navigate anywhere
        return undefined
    }

    return undefined
}

export type UseOnSubmitEditOptions = {
    modelId: string
    section: ModelSection
    groups?: GroupsConfig
}

export type UseOnSubmitNewOptions = {
    section: ModelSection
    groups?: GroupsConfig
}

export const useOnEditCompletedSuccessfully = (section: ModelSection) => {
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const queryClient = useQueryClient()
    const navigate = useNavigateWithSearchState()

    return useCallback(
        ({
            withChanges,
            navigateTo = defaultNavigateTo,
            response,
            submitAction = 'saveAndExit',
        }: {
            withChanges: boolean
            navigateTo?: GetToFunction | null
            submitAction?: SubmitAction
            response?: any
        }) => {
            if (withChanges) {
                saveAlert.show({
                    message: i18n.t('Saved successfully'),
                    success: true,
                })
            } else {
                saveAlert.show({
                    message: i18n.t('No changes to be saved'),
                })
            }
            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })

            if (navigateTo) {
                const navTo = navigateTo({
                    section,
                    submitAction,
                    responseData: response?.data,
                })
                if (navTo) {
                    navigate(navTo)
                }
            }
        },
        [saveAlert, queryClient, navigate, section]
    )
}

export const useOnSubmitEdit = <TFormValues extends IdentifiableObject>({
    modelId,
    section,
    groups,
}: UseOnSubmitEditOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(section)
    const syncGroupMembership = useSyncGroupMembership(
        groups && {
            resource: section.namePlural,
            groupResource: groups.resource,
        }
    )
    const groupSyncFailureAlert = useAlert(({ message }) => message, {
        critical: true,
    })

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, form, options) => {
            const formState = form.getState()
            const dirtyFields = { ...formState.dirtyFields }
            const initialValues =
                (formState.initialValues as Record<string, unknown>) ?? {}

            const groupsFieldName = groups?.resource
            const groupsDirty = groupsFieldName
                ? !!dirtyFields[groupsFieldName]
                : false
            // The groups field is synced via dedicated endpoints, not via JSON-PATCH.
            if (groupsFieldName) {
                delete dirtyFields[groupsFieldName]
            }
            const valuesForPatch = groupsFieldName
                ? (() => {
                      const copy = { ...values } as Record<string, unknown>
                      delete copy[groupsFieldName]
                      return copy as TFormValues
                  })()
                : values

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

            if (groupsFieldName && groupsDirty) {
                const next = (values as Record<string, unknown>)[
                    groupsFieldName
                ] as GroupRef[] | undefined
                const prev = initialValues[groupsFieldName] as
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
            groups,
        ]
    )
}

export const defaultValueFormatter = <
    TFormValues extends ModelWithAttributeValues
>(
    values: TFormValues
) => {
    if (values.attributeValues) {
        return {
            ...values,
            attributeValues: values.attributeValues.filter(
                ({ value }) => !!value
            ),
        }
    }
    return values
}

export const useOnSubmitNew = <
    TFormValues extends Record<string, unknown> & ModelWithAttributeValues
>({
    section,
    groups,
}: UseOnSubmitNewOptions) => {
    const createModel = useCreateModel(section.namePlural)
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const groupSyncFailureAlert = useAlert(({ message }) => message, {
        critical: true,
    })
    const navigate = useNavigateWithSearchState()
    const [searchParams] = useSearchParams()
    const syncGroupMembership = useSyncGroupMembership(
        groups && {
            resource: section.namePlural,
            groupResource: groups.resource,
        }
    )

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, form, options) => {
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

            const groupsFieldName = groups?.resource
            const selectedGroups = groupsFieldName
                ? ((values as Record<string, unknown>)[groupsFieldName] as
                      | GroupRef[]
                      | undefined) ?? []
                : []
            const valuesForCreate = groupsFieldName
                ? (() => {
                      const copy = { ...values } as Record<string, unknown>
                      delete copy[groupsFieldName]
                      return copy
                  })()
                : values

            const response = await createModel(valuesForCreate)
            if (response.error) {
                return createFormError(response.error)
            }

            if (groupsFieldName && selectedGroups.length > 0) {
                const responseData = response.data as
                    | { response?: { uid?: string; id?: string } }
                    | undefined
                const newId =
                    responseData?.response?.uid ?? responseData?.response?.id
                if (newId) {
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
            queryClient,
            createModel,
            saveAlert,
            groupSyncFailureAlert,
            navigate,
            section,
            searchParams,
            syncGroupMembership,
            groups,
        ]
    )
}
