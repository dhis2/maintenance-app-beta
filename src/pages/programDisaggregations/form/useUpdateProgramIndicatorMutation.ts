import { useDataEngine } from '@dhis2/app-runtime'
import { pick } from 'lodash'
import { useCallback } from 'react'
import { parseErrorResponse, SECTIONS_MAP, usePatchModel } from '../../../lib'
import { JsonPatchOperation } from '../../../types'
import {
    CategoryMappingsRecord,
    ProgramIndicatorMappingsRecord,
} from './programDisaggregationSchema'

export const useUpdateProgramIndicatorMutation = () => {
    const engine = useDataEngine()

    return useCallback(
        async (
            programIndicatorId: string,
            programIndicatorMapping:
                | ProgramIndicatorMappingsRecord[string]
                | null
        ) => {
            const newCategoryCombo = programIndicatorMapping?.categoryCombo
                ? pick(programIndicatorMapping.categoryCombo, [
                      'id',
                      'displayName',
                  ])
                : null

            const newCategoryMappingsIds =
                programIndicatorMapping?.categoryCombo
                    ? programIndicatorMapping.categoryCombo.categories.map(
                          (category) =>
                              programIndicatorMapping.disaggregation[
                                  category.id
                              ]
                      )
                    : []
            const newAggregateExportDataElement =
                programIndicatorMapping?.aggregateExportDataElement

            const patchOperations = {
                type: 'json-patch',
                resource: SECTIONS_MAP.programIndicator.namePlural,
                id: programIndicatorId,
                data: [
                    {
                        op: 'replace',
                        path: '/categoryCombo',
                        value: newCategoryCombo,
                    },
                    {
                        op: 'replace',
                        path: '/categoryMappingIds',
                        value: newCategoryMappingsIds,
                    },
                    {
                        op: 'replace',
                        path: '/aggregateExportDataElement',
                        value: newAggregateExportDataElement,
                    },
                ],
            } as const

            try {
                const response = await engine.mutate(patchOperations)
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [engine]
    )
}

export const useUpdateProgramMutation = (programId: string) => {
    const patchModel = usePatchModel(programId, SECTIONS_MAP.program.namePlural)

    return useCallback(
        async (
            categoryMappings: CategoryMappingsRecord & { deleted?: string[] }
        ) => {
            const { deleted, ...updatedCategoryMappings } = categoryMappings

            const cleanCatMappings = Object.fromEntries(
                Object.entries(updatedCategoryMappings).filter(
                    ([key]) => !deleted?.includes(key)
                )
            )

            const newCategoryMappings = Object.values(cleanCatMappings)
                .flat()
                .filter((mapping) => !mapping.deleted)
                .map(({ id, categoryId, mappingName, options }) => ({
                    id,
                    categoryId,
                    mappingName,
                    optionMappings:
                        options &&
                        Object.entries(options).map(([id, value]) => ({
                            optionId: id,
                            filter: value.filter,
                        })),
                }))

            const programsJsonPatchOperations: JsonPatchOperation[] = [
                {
                    op: 'replace',
                    path: '/categoryMappings',
                    value: newCategoryMappings,
                },
            ]

            return await patchModel(programsJsonPatchOperations)
        },
        [patchModel]
    )
}
