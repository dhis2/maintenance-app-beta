import { FormProps } from 'react-final-form'
import { usePatchModel } from './usePatchModel'
import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { createJsonPatchOperations } from './createJsonPatchOperations'
import { useNavigate } from 'react-router-dom'
import { ModelSection } from '../../types'
import { useMemo } from 'react'
import { IdentifiableObject } from '../../types/generated'
import { getSectionPath } from '../routeUtils'
import { useCreateModel } from './useCreateModel'

type OnSubmit<TValues> = FormProps<TValues>['onSubmit']

type UseOnSubmitOptions = {
    modelId: string
    section: ModelSection
}

export const useOnSubmitEdit = <TFormValues extends IdentifiableObject>({
    modelId,
    section,
}: UseOnSubmitOptions) => {
    const patchDirtyFields = usePatchModel(modelId, section.namePlural)
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigate()

    return useMemo<OnSubmit<TFormValues>>(
        () => async (values, form) => {
            const jsonPatchOperations = createJsonPatchOperations({
                values,
                dirtyFields: form.getState().dirtyFields,
                originalValue: form.getState().initialValues,
            })
            if (jsonPatchOperations.length < 1) {
                saveAlert.show({
                    message: 'No changes to be saved',
                })
                navigate(`/${getSectionPath(section)}`)
                return
            }
            const errors = await patchDirtyFields(jsonPatchOperations)
            if (errors) {
                return errors
            }
            saveAlert.show({ message: 'Saved successfully', success: true })
            navigate(`/${getSectionPath(section)}`)
        },
        [patchDirtyFields, saveAlert, navigate]
    )
}

export const useOnSubmitNew = <TFormValues extends IdentifiableObject>({
    section,
}: UseOnSubmitOptions) => {
    const dataEngine = useDataEngine()
    const createModel = useCreateModel(section.namePlural)
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigate()

    return useMemo<OnSubmit<TFormValues>>(
        () => async (values, form) => {
            if (!values) {
                console.error('Tried to save new object without any changes', {
                    values,
                })
                saveAlert.show({
                    message: 'Cannot save empty object',
                    error: true,
                })
                return
            }
            const errors = await createModel(values)
            if (errors) {
                return errors
            }
            saveAlert.show({ message: 'Created successfully', success: true })
            navigate(`/${getSectionPath(section)}`)
        },
        [createModel, saveAlert, navigate]
    )
}
