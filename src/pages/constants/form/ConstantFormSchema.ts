import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'
import { Constant, PickWithFieldFilters } from '../../../types/generated'
import { fieldFilters } from './fieldFilters'
const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

const constantBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    value: z.coerce.number({
        invalid_type_error: i18n.t('Please enter a number'),
    }),
})

export const constantFormSchema = identifiable.merge(constantBaseSchema)

export const ConstantsListSchema = constantBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaultsOld(constantFormSchema)
export const validate = createFormValidate(constantFormSchema)
export type ConstantFormValues = PickWithFieldFilters<
    Constant,
    typeof fieldFilters
>
