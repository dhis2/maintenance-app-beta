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
export function getDefaults<T extends z.AnyZodObject | z.ZodEffects<any>>(
    schema: T,
    defaults?: Partial<z.input<T>>
): z.infer<WrapNonDefaultsInOptional<T>> {
    // Check if it's a ZodEffect
    if (schema instanceof z.ZodEffects) {
        // Check if it's a recursive ZodEffect
        if (schema.innerType() instanceof z.ZodEffects) {
            return getDefaults(schema.innerType(), defaults)
        }
        // return schema inner shape as a fresh zodObject
        return getDefaults(
            z.ZodObject.create(schema.innerType().shape),
            defaults
        )
    }

    function getDefaultValue(
        innerSchema: z.ZodTypeAny,
        providedValue: unknown
    ): unknown {
        // use provided default if exists
        if (providedValue !== undefined) {
            if (
                innerSchema instanceof z.ZodObject &&
                typeof providedValue === 'object' &&
                providedValue !== null
            ) {
                return getDefaults(innerSchema, providedValue as any)
            }
            return providedValue
        }

        // return an empty array if it is
        if (innerSchema instanceof z.ZodArray) {
            return []
        }
        // return content of object recursively
        if (innerSchema instanceof z.ZodObject) {
            return getDefaults(innerSchema, {})
        }
        if (innerSchema instanceof z.ZodOptional) {
            return undefined
        }
        if (!('innerType' in innerSchema._def)) {
            return undefined
        }
        return getDefaultValue(innerSchema._def.innerType, providedValue)
    }

    return Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            const provided = defaults?.[key as keyof z.input<T>]
            return [key, getDefaultValue(value as z.ZodTypeAny, provided)]
        })
    )
}
