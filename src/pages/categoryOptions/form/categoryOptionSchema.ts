import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import i18n from '@dhis2/d2-i18n'

const { withAttributeValues, identifiable, referenceCollection } =
    modelFormSchemas

export const categoryOptionSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional(),
        shortName: z.string().trim(),
        formName: z.string().trim().optional(),
        description: z.string().trim().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        organisationUnits: referenceCollection.optional(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return data.startDate <= data.endDate
            }
            return true
        },
        {
            message: i18n.t('End date should be after start date'),
            path: ['endDate'],
        }
    )

export const initialValues = getDefaults(categoryOptionSchema)

export const validate = createFormValidate(categoryOptionSchema)
