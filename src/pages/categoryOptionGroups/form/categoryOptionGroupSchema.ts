import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { CategoryOptionGroup } from '../../../types/generated'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const categoryOptionGroupSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        dataDimensionType: z
            .nativeEnum(CategoryOptionGroup.dataDimensionType)
            .default(CategoryOptionGroup.dataDimensionType.DISAGGREGATION),
        categoryOptions: referenceCollection
            .min(1, 'At least one category option is required')
            .default([]),
    })

export const initialValues = getDefaults(categoryOptionGroupSchema)

export const validate = createFormValidate(categoryOptionGroupSchema)
