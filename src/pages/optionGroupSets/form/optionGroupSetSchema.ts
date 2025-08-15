import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const { identifiable, referenceCollection, withDefaultListColumns } =
    modelFormSchemas

const optionGroupSetBaseSchema = z.object({
    code: z.string().trim().optional(),
})

export const optionGroupSetFormSchema = identifiable
    .merge(optionGroupSetBaseSchema)
    .extend({
        description: z.string().trim().optional(),
        dataDimension: z.boolean().default(false),
        optionSet: z.object({
            id: z.string(),
            displayName: z.string(),
        }),
        optionGroups: referenceCollection.default([]),
    })

export const optionGroupSetListSchema = optionGroupSetBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(optionGroupSetFormSchema)

export const validate = createFormValidate(optionGroupSetFormSchema)
