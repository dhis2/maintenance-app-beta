import { z } from 'zod'
import {
    DEFAULT_CATEGORY_COMBO,
    getDefaults,
    modelFormSchemas,
} from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'

const { withAttributeValues, identifiable, style, referenceCollection } =
    modelFormSchemas

export const dataSetFormSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        id: z.string().optional(),
        code: z.string().trim().optional(),
        description: z.string().trim().max(2000).optional(),
        style,
        dataElements: referenceCollection.default([]),
        categoryCombo: z
            .object({ id: z.string() })
            .default({ id: DEFAULT_CATEGORY_COMBO.id }),
        periodType: z.string().default('Monthly'),
    })

export const initialValues = getDefaults(dataSetFormSchema)

export const validate = createFormValidate(dataSetFormSchema)
