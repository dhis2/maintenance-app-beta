import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQueryClient } from '@tanstack/react-query'
import { FORM_ERROR } from 'final-form'
import { useMemo } from 'react'
import { FormProps } from 'react-final-form'
import { ModelSection } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { getSectionPath, useNavigateWithSearchState } from '../routeUtils'
import {
    createJsonPatchOperations,
    ModelWithAttributeValues,
} from './createJsonPatchOperations'
import { useCreateModel } from './useCreateModel'
import { usePatchModel } from './usePatchModel'

type OnSubmit<TValues> = FormProps<TValues>['onSubmit']

type UseOnSubmitEditOptions = {
    modelId: string
    section: ModelSection
}

export const useOnSubmitEdit = <TFormValues extends IdentifiableObject>({
    modelId,
    section,
}: UseOnSubmitEditOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const queryClient = useQueryClient()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    const navigate = useNavigateWithSearchState()

    return useMemo<OnSubmit<TFormValues>>(
        () => async (values, form) => {
            const jsonPatchOperations = createJsonPatchOperations({
                values,
                dirtyFields: form.getState().dirtyFields,
                originalValue: form.getState().initialValues,
            })
            if (jsonPatchOperations.length < 1) {
                saveAlert.show({
                    message: i18n.t('No changes to be saved'),
                })
                navigate(`/${getSectionPath(section)}`)
                return
            }
            const errors = await patchDirtyFields(jsonPatchOperations)
            if (errors) {
                return errors
            }
            saveAlert.show({
                message: i18n.t('Saved successfully'),
                success: true,
            })
            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })
            navigate(`/${getSectionPath(section)}`)
        },
        [patchDirtyFields, saveAlert, navigate, section]
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
}: {
    section: ModelSection
}) => {
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
            if (response[FORM_ERROR]) {
                return response
            }
            saveAlert.show({
                message: i18n.t('Created successfully'),
                success: true,
            })
            queryClient.invalidateQueries({
                queryKey: [{ resource: section.namePlural }],
            })
            navigate(`/${getSectionPath(section)}`)
            return response
        },
        [createModel, saveAlert, navigate, section]
    )
}
