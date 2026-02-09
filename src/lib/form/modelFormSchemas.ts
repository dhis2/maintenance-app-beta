import { z } from 'zod'

/*  Note that these schemas describes validations for what we send to the server,
    and not what is stored in the form. Unknown keys are stripped by default. */

const modelReference = z.object({
    id: z.string(),
    displayName: z.string().optional(),
})
const referenceCollection = z.array(modelReference)

/* Note that ID is optional here because we don't have ID when creating/POSTING models */
const identifiable = z.object({
    id: z.string().optional(),
    name: z.string().trim(),
    displayName: z.string().optional(),
})

const attributeValues = z
    .array(
        z.object({
            value: z.string(),
            attribute: z.object({
                id: z.string(),
            }),
        })
    )
    .default([])

const withAttributeValues = z.object({
    attributeValues: attributeValues,
})

const style = z.object({
    color: z.string().optional(),
    icon: z.string().optional(),
})

export const UserSchema = identifiable.extend({
    code: z.string().or(z.null()),
    displayName: z.string(),
    username: z.string(),
})

export const UserGroupSchema = identifiable.extend({
    displayName: z.string(),
})

export const AccessSchema = z.object({
    delete: z.boolean(),
    externalize: z.boolean(),
    manage: z.boolean(),
    read: z.boolean(),
    update: z.boolean(),
    write: z.boolean(),
    data: z
        .object({
            read: z.boolean(),
            write: z.boolean(),
        })
        .optional(),
})

const dateTimeString = z
    .string()
    .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/,
        'Invalid date-time format, expected YYYY-MM-DDTHH:mm:ss.sss'
    )

const withDefaultListColumns = z.object({
    id: z.string(),
    displayName: z.string(),
    created: dateTimeString,
    createdBy: UserSchema,
    href: z.string().url(),
    lastUpdated: dateTimeString,
    lastUpdatedBy: UserSchema.optional(),
    // todo: change this to accept all possible
    sharing: z.object({ public: z.literal('rw------') }),
    access: AccessSchema,
})

export const modelFormSchemas = {
    objectReference: modelReference,
    referenceCollection,
    identifiable,
    attributeValues,
    withAttributeValues,
    style,
    modelReference,
    withDefaultListColumns,
}
