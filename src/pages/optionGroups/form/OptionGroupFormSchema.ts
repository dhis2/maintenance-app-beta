import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { OptionGroup, PickWithFieldFilters } from '../../../types/generated'
import { fieldFilters } from './fieldFilters'

const { identifiable, style, withDefaultListColumns } = modelFormSchemas

const optionGroupBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    options: z.array(
        z.object({
            id: z.string(),
        })
    ),
    optionSet: z.object({
        id: z.string(),
    }),
})

export const optionGroupFormSchema = identifiable
    .merge(optionGroupBaseSchema)
    .merge(style)

export const OptionGroupListSchema = optionGroupBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(optionGroupFormSchema)
export const validate = createFormValidate(optionGroupFormSchema)

export type OptionGroupFormValues = PickWithFieldFilters<
    OptionGroup,
    typeof fieldFilters
>
