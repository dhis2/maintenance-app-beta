import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
} from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const { identifiable, referenceCollection, withDefaultListColumns } =
    modelFormSchemas

const predictorGroupBaseSchema = z.object({
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
})

export const predictorGroupFormSchema = identifiable
    .merge(predictorGroupBaseSchema)
    .extend({
        predictors: referenceCollection.default([]),
    })

export const predictorGroupListSchema = predictorGroupBaseSchema.merge(
    withDefaultListColumns
)

export const initialValues = getDefaultsOld(predictorGroupFormSchema)

export const validate = createFormValidate(predictorGroupFormSchema)
