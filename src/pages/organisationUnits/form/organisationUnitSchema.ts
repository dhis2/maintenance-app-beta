import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'

const { withAttributeValues, identifiable, referenceCollection } =
    modelFormSchemas

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
                type: z.literal('Point'),
                coordinates: z.array(z.number()).length(2),
            })
            .or(
                z.object({
                    type: z.union([
                        z.literal('Multipoint'),
                        z.literal('Linestring'),
                        z.literal('Multilinestring'),
                        z.literal('Polygon'),
                        z.literal('Multipolygon'),
                        z.literal('Geometrycollection'),
                    ]),
                })
            )
            .optional(),
        programs: referenceCollection.optional().default([]),
        dataSets: referenceCollection.optional().default([]),
    })

export const initialValues = getDefaults(
    organisationUnitSchema as z.AnyZodObject
)
