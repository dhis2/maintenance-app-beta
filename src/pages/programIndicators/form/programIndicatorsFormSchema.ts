import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'

const { identifiable, referenceCollection, modelReference } = modelFormSchemas

export const programIndicatorFormSchema = identifiable.extend({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    style: z.object({
        color: z.string().optional(),
        icon: z.string().optional(),
    }),
    description: z.string().trim().optional(),
    program: modelReference,
    decimals: z.string().optional(),
    aggregationType: z.string().optional(),
    analyticsType: z.string(),
    orgUnitField: z.string().optional(),
    displayInForm: z.boolean().default(false),
    legendSets: referenceCollection.default([]),
    aggregateExportCategoryOptionCombo: z.string().optional(),
    aggregateExportAttributeOptionCombo: z.string().optional(),
    expression: z.string().optional(),
    filter: z.string().optional(),
    analyticsPeriodBoundaries: z.array(z.object({})).optional(),
})

export const initialValues = getDefaults(programIndicatorFormSchema)

export type ProgramIndicatorFormValues = typeof initialValues

export const validate = createFormValidate(programIndicatorFormSchema)
