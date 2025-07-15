import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { UserSchema } from '../../../lib/form/modelFormSchemas'
import { createFormValidate } from '../../../lib/form/validate'
import { ProgramIndicator } from '../../../types/generated'

const {
    identifiable,
    referenceCollection,
    modelReference,
    withAttributeValues,
    withDefaultListColumns,
} = modelFormSchemas

const ProgramIndicatorsBaseSchema = z.object({
    program: modelReference,
    aggregationType: z.nativeEnum(ProgramIndicator.aggregationType).optional(),
    analyticsType: z
        .nativeEnum(ProgramIndicator.analyticsType)
        .default(ProgramIndicator.analyticsType.EVENT),
    displayInForm: z.boolean().default(false),
    description: z.string().optional(),
    legendSets: referenceCollection.default([]),
    aggregateExportCategoryOptionCombo: z.string().optional(),
    aggregateExportAttributeOptionCombo: z.string().optional(),
    aggregateExportDataElement: z.string().optional(),
    expression: z.string().optional(),
    filter: z.string().optional(),
    orgUnitField: z.string().optional(),
    decimals: z.number().int().lte(5).gte(0).optional(),
})

export const ProgramIndicatorsListSchema = ProgramIndicatorsBaseSchema.merge(
    withDefaultListColumns
)
    .merge(withAttributeValues)
    .extend({
        program: modelReference,
        displayShortName: z.string(),
        displayDescription: z.string().optional(),
        displayFormName: z.string().optional(),
        user: UserSchema,
        favorite: z.boolean(),
        code: z.string().optional(),
    })

export const programIndicatorFormSchema = ProgramIndicatorsBaseSchema.merge(
    identifiable
)
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        style: z.object({
            color: z.string().optional(),
            icon: z.string().optional(),
        }),
        orgUnitField: z.string().optional(),
        analyticsPeriodBoundaries: z
            .array(
                z.object({
                    id: z.string().optional(),
                    analyticsPeriodBoundaryType: z.string().optional(),
                    boundaryTarget: z.string().optional(),
                    offsetPeriods: z.number().optional(),
                })
            )
            .optional()
            .default([]),
    })

export const initialValues = getDefaults(programIndicatorFormSchema)

export type ProgramIndicatorFormValues = typeof initialValues

export const validate = createFormValidate(programIndicatorFormSchema)
