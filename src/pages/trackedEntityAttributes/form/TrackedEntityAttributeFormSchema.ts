import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import {
    PickWithFieldFilters,
    TrackedEntityAttribute,
} from '../../../types/generated'
import { fieldFilters } from './fieldFilters'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

const trackedEntityAttributeBaseSchema = z.object({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    formName: z.string().trim().optional(),
    optionSet: z
        .object({ id: z.string(), displayName: z.string().optional() })
        .optional(),
    valueType: z
        .nativeEnum(TrackedEntityAttribute.valueType)
        .default(TrackedEntityAttribute.valueType.TEXT),
    trackedEntityType: z
        .object({ id: z.string(), displayName: z.string().optional() })
        .optional(),
    unique: z.boolean().default(false),
    orgunitScope: z.boolean().default(false),
    generated: z.boolean().default(false),
    pattern: z.string().trim().optional(),
    fieldMask: z.string().trim().optional(),
    confidential: z.boolean().default(false),
    inherit: z.boolean().default(false),
    displayInListNoProgram: z.boolean().default(false),
    skipSynchronization: z.boolean().default(false),
    // TODO: Uncomment when version control is implemented (v43+)
    // trigramIndexable: z.boolean().default(false),
    aggregationType: z
        .nativeEnum(TrackedEntityAttribute.aggregationType)
        .default(TrackedEntityAttribute.aggregationType.NONE),
    legendSets: z
        .array(z.object({ id: z.string(), displayName: z.string().optional() }))
        .default([]),
})

export const trackedEntityAttributeListSchema = trackedEntityAttributeBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        displayShortName: z.string(),
    })

export const trackedEntityAttributeFormSchema = trackedEntityAttributeBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)

export const initialValues = getDefaults(trackedEntityAttributeFormSchema)

export type TrackedEntityAttributeFormValues = PickWithFieldFilters<
    TrackedEntityAttribute,
    typeof fieldFilters
>

export const validate = createFormValidate(trackedEntityAttributeFormSchema)
