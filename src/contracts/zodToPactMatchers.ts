import {ZodFirstPartyTypeKind } from 'zod';
import { like, eachLike, regex } from "@pact-foundation/pact/src/v3/matchers";

function unwrapSchema(schema: any): any {
    let def = schema._def;

    while (
        def.typeName === ZodFirstPartyTypeKind.ZodDefault ||
        def.typeName === ZodFirstPartyTypeKind.ZodOptional ||
        def.typeName === ZodFirstPartyTypeKind.ZodNullable
        ) {
        schema = def.innerType;
        def = schema._def;
    }

    return schema;``
}

function handleSingle(schema: any, withOptionals: boolean): any {
    const unwrappedSchema = unwrapSchema(schema);
    const def = unwrappedSchema._def;

    switch (def.typeName) {
        case ZodFirstPartyTypeKind.ZodString:
            if (def.checks?.some((c:any) => c.kind === 'url')) {
                return regex('^https?://.*', 'https://example.com');
            }
            return like('example string');

        case ZodFirstPartyTypeKind.ZodNumber:
            return like(42);

        case ZodFirstPartyTypeKind.ZodBoolean:
            return like(true);

        case ZodFirstPartyTypeKind.ZodDate:
            return like(new Date().toISOString());

        case ZodFirstPartyTypeKind.ZodLiteral:
            return like(def.value);

        case ZodFirstPartyTypeKind.ZodEnum:
            return regex(def.values.join('|'), def.values[0]);

        case ZodFirstPartyTypeKind.ZodNativeEnum: {
            const values = Object.values(def.values).filter((v) => typeof v === 'string');
            const escapedValues = values.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const pattern = `^(${escapedValues.join('|')})$`;
            return regex(pattern, values[0]);
        }

        case ZodFirstPartyTypeKind.ZodArray:
            return eachLike(handleSingle(def.type, withOptionals));

        case ZodFirstPartyTypeKind.ZodUnion: {
            const options = def.options;
            const isAllLiterals = options.every((opt) => opt._def.typeName === ZodFirstPartyTypeKind.ZodLiteral);

            if (isAllLiterals) {
                const values = options.map((opt) => opt._def.value);
                return regex(values.join('|'), values[0]);
            } else {
                return handleSingle(options[0], withOptionals); // fallback
            }
        }

        case ZodFirstPartyTypeKind.ZodNullable:
        case ZodFirstPartyTypeKind.ZodOptional:
            return handleSingle(def.innerType, withOptionals);

        case ZodFirstPartyTypeKind.ZodObject: {
            const shape = def.shape();
            const full = {};
            const withoutOptional = {};

            for (const key in shape) {
                const field = shape[key];
                const isOptional = typeof field.isOptional === 'function' && field.isOptional();

                const sub = zodToPactMatchers(field, withOptionals);
                full[key] = sub;

                if (!isOptional) {
                    withoutOptional[key] = sub;
                }
            }

            return withOptionals ?  like(full) : like(withoutOptional)
        }

        default: {
            console.log("********UNSUPPORTED TYPE: ", def.typeName)
            return like('unsupported');

        }
    }
}

export const  zodToPactMatchers = (schema: any, withOptionals: boolean) =>  {
    const def = schema._def;

    if (def.typeName === ZodFirstPartyTypeKind.ZodObject) {
        return handleSingle(schema, withOptionals);
    }

    const matcher = handleSingle(schema, withOptionals);
    return matcher
}

