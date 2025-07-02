import { z } from 'zod'
import {  modelFormSchemas  } from '../../../lib/form/modelFormSchemas'
import { getDefaults  } from '../../../lib/zod/getDefaults'
import { createFormValidate  } from '../../../lib/form/validate'
import { Category } from '../../../types/generated'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const {
    identifiable,
    referenceCollection,
    withAttributeValues,
    withDefaultListColumns,
} = modelFormSchemas

const categoryBaseSchema = z.object({
    code: z.string().trim().optional(),
    dataDimensionType: z
        .nativeEnum(Category.dataDimensionType)
        .default(Category.dataDimensionType.DISAGGREGATION),
})

export const categoryFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(categoryBaseSchema)
    .extend({
        shortName: z.string().trim(),
        description: z.string().trim().optional(),
        dataDimension: z.boolean().default(true),
        categoryOptions: referenceCollection
            .min(1, 'At least one category option is required')
            .default([]),
    })

export const categoryListSchema = categoryBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(categoryFormSchema)

export const validate = createFormValidate(categoryFormSchema)
