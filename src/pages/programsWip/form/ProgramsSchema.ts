import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns } = modelFormSchemas

const programBaseSchema = z.object({
    code: z.string().optional(),
})
export const programFormSchema = identifiable.merge(programBaseSchema)

export const programListSchema = programBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(programFormSchema)

export const validate = createFormValidate(programFormSchema)
