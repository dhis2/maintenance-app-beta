import { z } from 'zod'
import { ProgramData, ProgramIndicatorData } from '../Edit'
import { CategoryCombo } from './../../../types/generated/models'

export const categoryOptionMapping = z.object({
    filter: z.string(),
    optionId: z.string(),
})

export const categoryMapping = z.object({
    id: z.string(),
    categoryId: z.string(),
    mappingName: z.string(),
    deleted: z.boolean(),
    options: z.record(categoryOptionMapping),
})

export const programIndicatorSchema = z.object({
    categoryCombo: z
        .object({
            id: z.string(),
            displayName: z.string(),
            dataDimensionType: z.nativeEnum(CategoryCombo.dataDimensionType),
            categories: z.array(
                z.object({
                    id: z.string(),
                    displayName: z.string(),
                })
            ),
        })
        .optional(),
    attributeCombo: z
        .object({
            id: z.string(),
            displayName: z.string(),
            dataDimensionType: z.nativeEnum(CategoryCombo.dataDimensionType),
            categories: z.array(
                z.object({
                    id: z.string(),
                    displayName: z.string(),
                })
            ),
        })
        .optional(),
    // map from categoryId to categoryMapping
    disaggregation: z.record(z.string(), z.string()),
    attribute: z.record(z.string(), z.string()),
})
const categoryMappingsRecord = z.record(z.string(), z.array(categoryMapping))
const programIndicatorMappingsRecord = z.record(programIndicatorSchema)

export const schema = z.object({
    categoryMappings: categoryMappingsRecord,
    programIndicatorMappings: programIndicatorMappingsRecord,
})

export const apiResponseToFormValues = ({
    program,
    programIndicators,
}: {
    program: ProgramData
    programIndicators: ProgramIndicatorData
}) => {
    // group categoryMappings per categoryId
    const categoryMappings = program.categoryMappings.reduce((acc, mapping) => {
        acc[mapping.categoryId] = [
            ...(acc[mapping.categoryId] || []),
            {
                ...mapping,
                deleted: false,
                options: mapping.optionMappings.reduce((opts, opt) => {
                    opts[opt.optionId] = {
                        filter: opt.filter,
                        optionId: opt.optionId,
                    }
                    return opts
                }, {} as Record<string, { filter: string; optionId: string }>),
            },
        ]
        return acc
    }, {} as z.infer<typeof categoryMappingsRecord>)
    const programIndicatorMappings = programIndicators.programIndicators.reduce(
        (acc, indicator) => {
            const disAggCombo = indicator.categoryCombo
            const attributeCombo = indicator.attributeCombo

            const getMappingType = (
                catMapping: z.infer<typeof categoryMapping>
            ) => {
                const inCombo = [disAggCombo, attributeCombo].find((combo) =>
                    combo.categories.some(
                        (cat) => cat.id === catMapping.categoryId
                    )
                )
                return inCombo?.dataDimensionType
            }
            const mappingsList = Object.values(categoryMappings).flat()
            const mappingByComboType = {
                disaggregation: {},
                attribute: {},
            }

            indicator.categoryMappingIds.forEach((categoryMappingId) => {
                const categoryMapping = mappingsList.find(
                    (cm) => cm.id === categoryMappingId
                )
                if (!categoryMapping) {
                    return acc
                }
                const type = getMappingType(categoryMapping)
                if (!type) {
                    return acc
                }
                const key =
                    type === CategoryCombo.dataDimensionType.DISAGGREGATION
                        ? 'disaggregation'
                        : 'attribute'

                mappingByComboType[key] = {
                    ...mappingByComboType[key],
                    [categoryMapping.categoryId]: categoryMappingId,
                }
            })
            acc[indicator.id] = {
                ...indicator,
                ...mappingByComboType,
            }
            return acc
        },
        {} as z.infer<typeof programIndicatorMappingsRecord>
    )

    return { categoryMappings, programIndicatorMappings }
}
