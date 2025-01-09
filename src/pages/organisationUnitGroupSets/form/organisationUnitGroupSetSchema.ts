import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const organisationUnitGroupSetSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        compulsory: z.boolean().optional(),
        dataDimension: z.boolean().optional().default(true),
        includeSubhierarchyInAnalytics: z.boolean().optional(),
        organisationUnitGroups: z.array(z.object({ id: z.string() })),
    })

export const initialValues = getDefaults(organisationUnitGroupSetSchema)

export const validate = createFormValidate(organisationUnitGroupSetSchema)
