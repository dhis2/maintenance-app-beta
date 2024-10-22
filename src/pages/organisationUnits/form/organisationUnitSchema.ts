import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'

const { withAttributeValues, identifiable } = modelFormSchemas

export const organisationUnitSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim().default(''),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        image: z.object({ id: z.string() }).optional(),
        phoneNumber: z.string().optional(),
        contactPerson: z.string().optional(),
        openingDate: z.string(),
        email: z.string().optional(),
        address: z.string().optional(),
        url: z.string().optional(),
        closedDate: z.string().optional(),
        parent: z.object({ id: z.string() }).optional(),
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
