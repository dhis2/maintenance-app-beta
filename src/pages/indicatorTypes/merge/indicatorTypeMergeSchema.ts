import { z } from 'zod'
import { mergeFormSchemaBase } from '../../../components/merge'
import { createFormValidate } from '../../../lib'

export const mergeFormSchema = mergeFormSchemaBase
export type IndicatorTypeMergeFormValues = z.input<typeof mergeFormSchema>

export const validate = createFormValidate(mergeFormSchema)
