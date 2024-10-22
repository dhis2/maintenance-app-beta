import { setIn } from 'final-form'
import { z } from 'zod'
import { segmentsToPath } from '../zod'

export function validate<FormValues>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zodSchema: z.ZodType<any, any, any>,
    values: FormValues
) {
    const zodResult = zodSchema.safeParse(values)
    if (zodResult.success !== false) {
        return undefined
    }

    const allFormErrors = zodResult.error.issues.reduce((formErrors, error) => {
        const errorPath = segmentsToPath(error.path)
        return setIn(formErrors, errorPath, error.message)
    }, {})
    return allFormErrors
}

export function createFormValidate(zodSchema: z.ZodTypeAny) {
    return <FormValues>(values: FormValues) => validate(zodSchema, values)
}
