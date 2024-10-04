import { z } from 'zod'

type WrapNonDefaultsInOptional<T extends z.ZodTypeAny> = T extends z.ZodEffects<
    infer Obj
>
    ? WrapNonDefaultsInOptional<Obj>
    : T extends z.ZodObject<infer Shape>
    ? z.ZodObject<{ [K in keyof Shape]: WrapNonDefaultsInOptional<Shape[K]> }>
    : T extends z.ZodDefault<infer Default>
    ? Default
    : z.ZodOptional<T>

// inspired by: https://github.com/colinhacks/zod/discussions/1953#discussioncomment-5695528
// added some type-improvements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDefaults<T extends z.AnyZodObject | z.ZodEffects<any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: T //z.AnyZodObject | z.ZodEffects<any>
): z.infer<WrapNonDefaultsInOptional<T>> {
    // Check if it's a ZodEffect
    if (schema instanceof z.ZodEffects) {
        // Check if it's a recursive ZodEffect
        if (schema.innerType() instanceof z.ZodEffects) {
            return getDefaults(schema.innerType())
        }
        // return schema inner shape as a fresh zodObject
        return getDefaults(z.ZodObject.create(schema.innerType().shape))
    }

    function getDefaultValue(innerSchema: z.ZodTypeAny): unknown {
        if (innerSchema instanceof z.ZodDefault) {
            return innerSchema._def.defaultValue()
        }
        // return an empty array if it is
        if (innerSchema instanceof z.ZodArray) {
            return []
        }
        // return an empty string if it is
        if (innerSchema instanceof z.ZodString) {
            return ''
        }
        // return an content of object recursivly
        if (innerSchema instanceof z.ZodObject) {
            return getDefaults(innerSchema)
        }

        if (!('innerType' in innerSchema._def)) {
            return undefined
        }
        return getDefaultValue(innerSchema._def.innerType)
    }

    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            return [key, getDefaultValue(value as z.ZodTypeAny)]
        })
    )
}
