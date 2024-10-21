import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import i18n from '@dhis2/d2-i18n'

const { withAttributeValues } = modelFormSchemas

export const organisationUnitSchema = withAttributeValues.extend({
    name: z.string().trim().default(''),
    shortName: z.string().trim().default(''),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    image: z.object({ id: z.string() }).optional(),
    phoneNumber: z.string().optional(),
    contactPerson: z.string().optional(),
    openingDate: z.string().default(''),
    email: z.string().optional(),
    address: z.string().optional(),
    url: z.string().optional(),
    closedDate: z.string().optional(),
    geometry: z
        .object({
            longitude: z.string().optional(),
            latitude: z.string().optional(),
        })
        .optional(),
})

export const initialValues = getDefaults(
    organisationUnitSchema as z.AnyZodObject
)
