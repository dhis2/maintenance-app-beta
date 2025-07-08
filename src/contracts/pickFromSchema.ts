import { z, ZodObject, ZodTypeAny } from 'zod'

// Utility: Convert bracket notation to array path
const parsePath = (path: string): string[] =>
    path.replace(/\[(\w+)\]/g, '.$1').split('.')

// Utility: Recursively pick fields from Zod schema
export const pickFromSchema = (
    schema: ZodObject<any>,
    paths: string[]
): ZodObject<any> => {
    const shape: Record<string, ZodTypeAny> = {}

    for (const path of paths) {
        const segments = parsePath(path)
        let currentSchema = schema
        let currentShape = shape

        for (let i = 0; i < segments.length; i++) {
            const key = segments[i]

            const originalShape = currentSchema.shape
            const fieldSchema = originalShape?.[key]
            if (!fieldSchema) break

            if (i === segments.length - 1) {
                currentShape[key] = fieldSchema
            } else {
                if (!currentShape[key]) {
                    currentShape[key] = z.object({})
                }
                if (!(fieldSchema instanceof ZodObject)) break
                currentSchema = fieldSchema
                currentShape = (currentShape[key] as ZodObject<any>).shape
            }
        }
    }

    return z.object(shape)
}

