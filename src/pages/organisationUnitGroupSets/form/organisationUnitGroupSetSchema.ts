import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
} from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

const organisationUnitGroupSetBaseSchema = z.object({
    code: z.string().trim().optional(),
})

export const organisationUnitGroupSetFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(organisationUnitGroupSetBaseSchema)
    .extend({
        shortName: z.string().trim(),
        description: z.string().trim().optional(),
        compulsory: z.boolean().optional(),
        dataDimension: z.boolean().optional().default(true),
        includeSubhierarchyInAnalytics: z.boolean().optional(),
        organisationUnitGroups: z.array(z.object({ id: z.string() })),
    })

export const organisationUnitGroupSetListSchema = withDefaultListColumns
    .merge(organisationUnitGroupSetBaseSchema)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaultsOld(organisationUnitGroupSetFormSchema)

export const validate = createFormValidate(organisationUnitGroupSetFormSchema)
