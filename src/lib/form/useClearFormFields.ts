import { FormApi } from 'final-form'
import { useCallback } from 'react'

export const useClearFormFields = (
    form: FormApi,
    ...fieldNames: string[]
): (() => void) =>
    useCallback(() => {
        form.batch(() => {
            fieldNames.forEach((field) => form.change(field, undefined))
        })
    }, [form, fieldNames])
