import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { OptionSet, PickWithFieldFilters } from '../../../types/generated'
import { fieldFilters } from '../../constants/form/fieldFilters'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

export const optionSetBaseSchema = z.object({
    name: z.string().trim(),
    displayName: z.string().trim().optional(),
    valueType: z.string(),
    code: z.string().trim().optional(),
})

export const optionSetListSchema = identifiable
    .merge(optionSetBaseSchema)
    .merge(withAttributeValues)
    .merge(withDefaultListColumns)

export const optionSetSchema = identifiable.merge(optionSetBaseSchema)
export const initialValues = getDefaults(optionSetSchema)

export type OptionSetFormValues = PickWithFieldFilters<
    OptionSet,
    typeof fieldFilters
>
export const validate = createFormValidate(optionSetSchema)
