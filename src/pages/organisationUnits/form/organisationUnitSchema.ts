import { z } from 'zod'

export const organisationUnitSchema = z.object({
    name: z.string().trim(),
    shortName: z.string().trim(),
    code: z.string().trim(),
    description: z.string().trim(),
    attributeValues: z.array(
        z.object({
            value: z.string().optional(),
            attribute: z.object({
                id: z.string(),
            }),
        })
    ),
    phoneNumber: z.string().optional(),
    contactPerson: z.string().optional(),
    openingDate: z.string(),
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
