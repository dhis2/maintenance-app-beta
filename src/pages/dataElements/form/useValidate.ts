import { setIn } from 'final-form'
import { useMemo } from 'react'
import { useSchemas } from '../../../lib'
import { createDataElementSchema } from './createDataElementSchema'
import type { FormValues } from './types'

// @TODO: Figure out if there's a utility for this? I couldn't find one
function segmentsToPath(segments: Array<string | number>) {
    return segments.reduce((path, segment) => {
        return typeof segment === 'number'
            ? `${path}[${segment}]`
            : `${path}.${segment}`
    }) as string
}

export function useValidate() {
    const schemas = useSchemas()
    const dataElementSchema = useMemo(
        () => createDataElementSchema(schemas),
        [schemas]
    )

    return (values: FormValues) => {
        const zodResult = dataElementSchema.safeParse(values)

        if (zodResult.success !== false) {
            return undefined
        }

        const allFormErrors = zodResult.error.issues.reduce(
            (formErrors, error) => {
                const errorPath = segmentsToPath(error.path)
                return setIn(formErrors, errorPath, error.message)
            },
            {}
        )

        return allFormErrors
    }
}
