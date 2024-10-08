import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import { FormProps } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { ModelSection } from '../../types'
import { IdentifiableObject } from '../../types/generated'
import { getSectionPath } from '../routeUtils'
import { createJsonPatchOperations } from './createJsonPatchOperations'
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
            navigate(`/${getSectionPath(section)}`)
        },
        [patchDirtyFields, saveAlert, navigate, section]
    )
}

export const useOnSubmitNew = <TFormValues>({
    section,
    valueFormatter,
}: {
    section: ModelSection
    valueFormatter?: (values: TFormValues) => Record<string, unknown>
}) => {
    const createModel = useCreateModel(section.namePlural)
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigate()

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
            const formattedValues = valueFormatter
                ? valueFormatter(values)
                : values
            const errors = await createModel(formattedValues)
            if (errors) {
                return errors
            }
            saveAlert.show({
                message: i18n.t('Created successfully'),
                success: true,
            })
            navigate(`/${getSectionPath(section)}`)
        },
        [createModel, saveAlert, navigate, section]
    )
}
