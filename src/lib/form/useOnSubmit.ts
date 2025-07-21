import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { FormProps } from 'react-final-form'
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

type OnSubmit<TValues> = FormProps<TValues>['onSubmit']

interface Navigateable {
    navigateTo?:
        | ((section: ModelSection) => string | undefined)
        | undefined
        | null
}

const defaultNavigate = {
    navigateTo: (section: ModelSection) => `/${getSectionPath(section)}`,
}
export type UseOnSubmitEditOptions = {
    modelId: string
    section: ModelSection
} & Navigateable

export type UseOnSubmitNewOptions = {
    section: ModelSection
} & Navigateable

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
            navigateTo,
        }: { withChanges: boolean } & Navigateable) => {
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
                const path = navigateTo(section)
                if (path) {
                    navigate(path)
                }
            }
        },
        [saveAlert, queryClient, navigate, section]
    )
}

export const useOnSubmitEdit = <TFormValues extends IdentifiableObject>({
    modelId,
    section,
    navigateTo = defaultNavigate.navigateTo,
}: UseOnSubmitEditOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(section)

    return useMemo<OnSubmit<TFormValues>>(
        () => async (values, form) => {
            const jsonPatchOperations = createJsonPatchOperations({
                values,
                dirtyFields: form.getState().dirtyFields,
                originalValue: form.getState().initialValues,
            })
            if (jsonPatchOperations.length < 1) {
                onEditCompletedSuccessfully({ withChanges: false, navigateTo })
                return
            }
            const response = await patchDirtyFields(jsonPatchOperations)

            if (response.error) {
                const err = createFormError(response.error)
                return err
            }
            onEditCompletedSuccessfully({ withChanges: true, navigateTo })
        },
        [patchDirtyFields, onEditCompletedSuccessfully, navigateTo]
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
    navigateTo = defaultNavigate.navigateTo,
}: UseOnSubmitNewOptions) => {
    const createModel = useCreateModel(section.namePlural)
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigateWithSearchState()

    return useMemo<OnSubmit<TFormValues>>(
        () => async (values) => {
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
            if (navigateTo) {
                const path = navigateTo(section)
                if (path) {
                    navigate(path)
                }
            }

            return response
        },
        [queryClient, createModel, saveAlert, navigate, section, navigateTo]
    )
}
