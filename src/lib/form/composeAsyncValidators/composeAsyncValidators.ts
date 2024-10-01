import type { FormFieldValidator } from './types'

export const composeAsyncValidators = <Value, FormValues = unknown>(
    validators: FormFieldValidator<Value, FormValues>[]
): FormFieldValidator<Value, FormValues> => {
    return async (value?: Value, formValues?: FormValues) => {
        for (let i = 0; i < validators.length; ++i) {
            const validator = validators[i]
            try {
                const result = await validator(value, formValues)
                if (result) {
                    return result
                }
            } catch (e) {
                console.error(e)
                return `Failed to run validation: ${(e as Error).toString()} `
            }
        }
    }
}
