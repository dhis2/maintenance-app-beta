import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { FormApi, SubmissionErrors } from 'final-form'
import { useCallback, useMemo } from 'react'
import { To } from 'react-router-dom'
import { Section } from '../../components/formCreators/SectionFormList'
import { DataEngine, ModelSection } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { getSectionPath, useNavigateWithSearchState } from '../routeUtils'
import { createFormError } from './createFormError'
import {
    createJsonPatchOperations,
    ModelWithAttributeValues,
} from './createJsonPatchOperations'
import { useCreateModel } from './useCreateModel'
import { usePatchModel } from './usePatchModel'

export type SubmitAction = 'save' | 'saveAndExit'

export type GetToFunction = (options: {
    section: ModelSection
    submitAction?: SubmitAction
    responseData?: unknown
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

const defaultNavigateTo: GetToFunction = ({
    section,
    submitAction = 'saveAndExit',
    responseData,
}) => {
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
            return `/${getSectionPath(section)}/${id}`
        }
        // if it's not a creation (eg. we edit), dont navigate anywhere
        return undefined
    }

    return undefined
}

export type UseOnSubmitEditOptions = {
    modelId: string
    section: ModelSection
}

export type UseOnSubmitNewOptions = {
    section: ModelSection
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
}: UseOnSubmitEditOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(section)

    return useMemo<EnhancedOnSubmit<TFormValues>>(
        () => async (values, form, options) => {
            const jsonPatchOperations = createJsonPatchOperations({
                values,
                dirtyFields: form.getState().dirtyFields,
                originalValue: form.getState().initialValues,
            })

            const navigateTo =
                options?.navigateTo === undefined
                    ? defaultNavigateTo
                    : options.navigateTo

            if (jsonPatchOperations.length < 1) {
                onEditCompletedSuccessfully({
                    withChanges: false,
                    response: null,
                    navigateTo,
                    submitAction: options?.submitAction,
                })
                return
            }
            const response = await patchDirtyFields(jsonPatchOperations)

            if (response.error) {
                const err = createFormError(response.error)
                return err
            }
            onEditCompletedSuccessfully({
                withChanges: true,
                response,
                navigateTo,
                submitAction: options?.submitAction,
            })
        },
        [patchDirtyFields, onEditCompletedSuccessfully]
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

export const useOnSubmitNew = <TFormValues extends ModelWithAttributeValues>({
    section,
}: UseOnSubmitNewOptions) => {
    const createModel = useCreateModel(section.namePlural)
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigateWithSearchState()

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
            const response = await createModel(values)
            if (response.error) {
                return createFormError(response.error)
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
                })
                if (navTo) {
                    navigate(navTo)
                }
            }
            return response
        },
        [queryClient, createModel, saveAlert, navigate, section]
    )
}

const getErrorMessage = (failures: string[]): string => {
    const customFormFailure = failures.slice(-1)?.[0] === 'customForm'
    const sectionFailures = customFormFailure
        ? failures.length > 1
        : failures.length > 0
    if (customFormFailure && !sectionFailures) {
        return 'There was an error deleting the custom form'
    }
    if (!customFormFailure && sectionFailures) {
        return 'There was an error deleting sections: {{sectionNames}}'
    }
    return 'There was an error deleting the custom form and sections: {{sectionNames}}'
}

export const useHandleOnSubmitEditFormDeletions = (
    section: ModelSection,
    sectionsFieldName: string,
    dataEngine: DataEngine,
    queryClient: QueryClient
) => {
    return useMemo(
        () =>
            async (
                sections: Section[],
                dataEntryForm:
                    | {
                          id: string
                          deleted?: boolean
                      }
                    | undefined
            ) => {
                const sectionsToDelete = sections.filter((s) => s.deleted)

                const customFormDeleteResult =
                    dataEntryForm?.deleted &&
                    (await Promise.allSettled([
                        dataEngine.mutate({
                            resource: 'dataEntryForms',
                            id: dataEntryForm.id,
                            type: 'delete',
                        }),
                    ]))

                const deletionResults = await Promise.allSettled(
                    sectionsToDelete.map((s) =>
                        dataEngine.mutate({
                            resource: sectionsFieldName,
                            id: s.id,
                            type: 'delete',
                        })
                    )
                )

                const failures = deletionResults
                    .map((deletion, i) => ({
                        ...deletion,
                        sectionName: sectionsToDelete[i].displayName,
                        type: 'section',
                    }))
                    .filter((deletion) => deletion.status === 'rejected')

                if (
                    customFormDeleteResult &&
                    customFormDeleteResult?.[0]?.status === 'rejected'
                ) {
                    failures.push({
                        ...customFormDeleteResult[0],
                        sectionName: '',
                        type: 'customForm',
                    })
                }

                if (failures.length > 0) {
                    await queryClient.invalidateQueries({
                        queryKey: [{ resource: section.namePlural }],
                    })
                    return {
                        error: createFormError({
                            message: i18n.t(
                                getErrorMessage(failures.map((f) => f.type)),
                                {
                                    sectionNames: failures
                                        .map((f) => f.sectionName)
                                        .join(', '),
                                    nsSeparator: '~-~',
                                }
                            ),
                            errors: failures.map((f) => f.reason.message),
                        }),
                    }
                }

                return { customFormDeleteResult }
            },
        [dataEngine, queryClient, section]
    )
}
