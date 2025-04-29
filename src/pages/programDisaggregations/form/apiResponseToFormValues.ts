import { z } from 'zod'
import { Category, CategoryCombo } from '../../../types/generated'
import { ProgramData, ProgramIndicatorData } from '../Edit'
import {
    categoryMapping,
    CategoryMappingsRecord,
    ProgramIndicatorMappingsRecord,
} from './programDisaggregationSchema'

const getMappingType = (
    catMapping: z.infer<typeof categoryMapping>,
    combos: {
        categories: {
            id: string
        }[]
        dataDimensionType: Category.dataDimensionType
    }[]
) => {
    const inCombo = combos.find((combo) =>
        combo.categories.some((cat) => cat.id === catMapping.categoryId)
    )
    return inCombo?.dataDimensionType
}

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
            ...(acc[mapping.categoryId] ?? []),
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
    }, {} as CategoryMappingsRecord)

    const programIndicatorMappings = programIndicators.programIndicators.reduce(
        (acc, indicator) => {
            const disAggCombo = indicator.categoryCombo
            const attributeCombo = indicator.attributeCombo

            const categoryMappingsMap = new Map(
                Object.values(categoryMappings)
                    .flat()
                    .map((cm) => [cm.id, cm])
            )
            const mappingByComboType = {
                disaggregation: {},
                attribute: {},
            }

            indicator.categoryMappingIds.forEach((categoryMappingId) => {
                const categoryMapping =
                    categoryMappingsMap.get(categoryMappingId)
                if (!categoryMapping) {
                    return acc
                }
                const type = getMappingType(categoryMapping, [
                    disAggCombo,
                    attributeCombo,
                ])
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
        {} as ProgramIndicatorMappingsRecord
    )

    return {
        categoryMappings,
        programIndicatorMappings,
    }
}
