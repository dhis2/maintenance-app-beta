import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../lib'
import { UserSchema } from '../../lib/form/modelFormSchemas'
import { DataSet, ProgramIndicator } from '../../types/generated'

const { identifiable, withDefaultListColumns } = modelFormSchemas

const ProgramIndicatorsBaseSchema = z.object({})
export const ProgramIndicatorsFormSchema = identifiable
    .merge(ProgramIndicatorsBaseSchema)
    .extend({})

export const ProgramIndicatorsListSchema = ProgramIndicatorsBaseSchema.merge(
    withDefaultListColumns
).extend({
    aggregationType: z
        .nativeEnum(ProgramIndicator.aggregationType)
        .default(ProgramIndicator.aggregationType.DEFAULT)
        .optional(),
    program: z.object({
        displayName: z.string(),
        id: z.string(),
    }),
    expression: z.string(),
    displayInForm: z.boolean(),
    analyticsType: z
        .nativeEnum(ProgramIndicator.analyticsType)
        .default(ProgramIndicator.analyticsType.EVENT),
    displayShortName: z.string(),
    displayDescription: z.string().optional(),
    displayFormName: z.string().optional(),
    decimals: z.number().optional(),
    user: UserSchema,
    favorite: z.boolean(),
    code: z.string().optional(),
    filter: z.string().optional(),
    aggregateExportCategoryOptionCombo: z.string().optional(),
    aggregateExportAttributeOptionCombo: z.string().optional(),
})

export const initialValues = getDefaults(ProgramIndicatorsFormSchema)

export const validate = createFormValidate(ProgramIndicatorsFormSchema)
