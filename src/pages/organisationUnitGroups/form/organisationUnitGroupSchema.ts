import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const organisationUnitGroupSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        compulsory: z.boolean(),
        color: z.string().optional(),
        symbol: z.string().optional(),
        organisationUnits: z.array(z.object({ id: z.string() })),
    })

export const initialValues = getDefaults(organisationUnitGroupSchema)

export const validate = createFormValidate(organisationUnitGroupSchema)
