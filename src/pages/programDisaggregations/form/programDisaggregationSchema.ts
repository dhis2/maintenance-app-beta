import { z } from 'zod'
import { CategoryCombo } from './../../../types/generated/models'

export const categoryOptionMapping = z.object({
    filter: z.string(),
    optionId: z.string(),
})

export const categoryMapping = z.object({
    id: z.string(),
    categoryId: z.string(),
    mappingName: z.string(),
    deleted: z.boolean(),
    options: z.record(categoryOptionMapping),
})
const identifiable = z.object({
    id: z.string(),
    displayName: z.string(),
})
const categoryComboSchema = z
    .object({
        id: z.string(),
        displayName: z.string(),
        dataDimensionType: z.nativeEnum(CategoryCombo.dataDimensionType),
        categories: z.array(
            identifiable.extend({
                categoryOptions: z.array(identifiable),
            })
        ),
    })
    .optional()

export const programIndicatorSchema = z.object({
    categoryCombo: categoryComboSchema.optional(),
    attributeCombo: categoryComboSchema.optional(),
    // map from categoryId to categoryMapping
    disaggregation: z.record(z.string(), z.string()),
    attribute: z.record(z.string(), z.string()),
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
})

const categoryMappingsRecord = z.record(z.string(), z.array(categoryMapping))
export const programIndicatorMappingsRecord = z.record(programIndicatorSchema)

export const programDisaggregationSchema = z.object({
    deletedCategories: z.array(z.string()).default([]),
    categoryMappings: categoryMappingsRecord.default({}),
    programIndicatorMappings: programIndicatorMappingsRecord.default({}),
})

export type CategoryMappingsRecord = z.infer<typeof categoryMappingsRecord>
export type ProgramIndicatorMappingsRecord = z.infer<
    typeof programIndicatorMappingsRecord
>

export type ProgramDisaggregationFormValues = z.infer<
    typeof programDisaggregationSchema
>
export type CategoryMapping = z.infer<typeof categoryMapping>
export type ProgramIndicatorMapping = z.infer<typeof programIndicatorSchema>
