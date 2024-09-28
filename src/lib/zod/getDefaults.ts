import { z } from 'zod'

// from: https://github.com/colinhacks/zod/discussions/1953#discussioncomment-4811588
export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            if (value instanceof z.ZodOptional) {
                value = value._def.innerType
            }
            if (value instanceof z.ZodDefault) {
                return [key, value._def.defaultValue()]
            }
            return [key, undefined]
        })
    )
}
