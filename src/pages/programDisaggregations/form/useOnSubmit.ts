import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { omitBy } from 'lodash'
import { useMemo } from 'react'
import { SECTIONS_MAP, useNavigateWithSearchState } from '../../../lib'
import { ProgramDisaggregationFormValues } from './programDisaggregationSchema'
import {
    useUpdateProgramIndicatorMutation,
    useUpdateProgramMutation,
} from './useUpdateProgramIndicatorMutation'

const cleanFormState = ({
    categoryMappings,
    deletedCategories,
    programIndicatorMappings,
}: ProgramDisaggregationFormValues): ProgramDisaggregationFormValues => {
    const deletedSet = new Set(deletedCategories)
    // remove soft-deleted
    const cleanedCategoryMappings = Object.fromEntries(
        Object.entries(categoryMappings).filter(
            ([categoryId]) => !deletedSet.has(categoryId)
        )
    )
    const categoryMappingsSet = new Set(
        Object.values(cleanedCategoryMappings).flatMap((categoryMapping) =>
            categoryMapping.map((cm) => cm.id)
        )
    )

    // remove references to mappings that are deleted
    const cleanedProgramIndicatorMappings = Object.fromEntries(
        Object.entries(programIndicatorMappings).map(
            ([programIndicatorId, programIndicator]) => {
                const attributeCategories = new Set(
                    programIndicator.attributeCombo?.categories.map(
                        (id) => id.id
                    )
                )
                const disaggregationCategories = new Set(
                    programIndicator.categoryCombo?.categories.map(
                        (id) => id.id
                    )
                )
                // remove deleted or otherwise invalid mappings
                const disaggregationWithoutDeleted = omitBy(
                    programIndicator.disaggregation,
                    (mappingId, categoryId) =>
                        !categoryMappingsSet.has(mappingId) ||
                        !disaggregationCategories.has(categoryId)
                )
                const attributeWithoutDeleted = omitBy(
                    programIndicator.attribute,
                    (mappingId, categoryId) =>
                        !categoryMappingsSet.has(mappingId) ||
                        !attributeCategories.has(categoryId)
                )
                return [
                    programIndicatorId,
                    {
                        ...programIndicator,
                        disaggregation: disaggregationWithoutDeleted,
                        attribute: attributeWithoutDeleted,
                    },
                ]
            }
        )
    )
    return {
        categoryMappings: cleanedCategoryMappings,
        deletedCategories: deletedCategories,
        programIndicatorMappings: cleanedProgramIndicatorMappings,
    }
}
// type ProgramDisaggregationFormValues = Zod.infer<typeof schema>
export const useOnSubmit = (
    programId: string,
    initialValues: ProgramDisaggregationFormValues
) => {
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    const patchPrograms = useUpdateProgramMutation(programId)
    const patchProgramIndicators = useUpdateProgramIndicatorMutation()
    const navigate = useNavigateWithSearchState()

    return useMemo(
        () => async (values: ProgramDisaggregationFormValues) => {
            const cleanedFormState = cleanFormState(values)

            if (!cleanedFormState) {
                console.error('Tried to save new object without any changes', {
                    values,
                })
                saveAlert.show({
                    message: i18n.t('Cannot save empty object'),
                    error: true,
                })
                return
            }

            const response = await patchPrograms({
                categoryMappings: cleanedFormState.categoryMappings,
            })

            if (response.error) {
                saveAlert.show({
                    message: i18n.t(
                        'Error while saving disaggregation categories'
                    ),
                    error: true,
                })
                return
            }

            const piMappingsUpdateResponses = await Promise.all(
                Object.keys(cleanedFormState.programIndicatorMappings).map(
                    async (programIndicatorId) => {
                        const programIndicatorMapping =
                            cleanedFormState.programIndicatorMappings[
                                programIndicatorId
                            ]

                        const response = await patchProgramIndicators(
                            programIndicatorId,
                            programIndicatorMapping
                        )

                        return { ...response, id: programIndicatorId }
                    }
                )
            )

            const piMappingsDeleteResponses = await Promise.all(
                Object.keys(initialValues.programIndicatorMappings)
                    .filter(
                        (piMapping) =>
                            !cleanedFormState.programIndicatorMappings[
                                piMapping
                            ]
                    )
                    .map(async (programIndicatorId) => {
                        const response = await patchProgramIndicators(
                            programIndicatorId,
                            null
                        )
                        return { ...response, id: programIndicatorId }
                    })
            )

            const piMappingsResponses = [
                ...piMappingsUpdateResponses,
                ...piMappingsDeleteResponses,
            ]

            const errors = piMappingsResponses.filter((res) => res.error)
            if (errors.length > 0) {
                saveAlert.show({
                    message: i18n.t(
                        `Error while updating mappings for program indicators with ids: ${errors
                            .map((r) => r.id)
                            .join(' - ')}`
                    ),
                    error: true,
                })
            } else {
                navigate(`/${SECTIONS_MAP.programDisaggregation.namePlural}`)
            }
        },
        [
            saveAlert,
            navigate,
            patchPrograms,
            initialValues.programIndicatorMappings,
            patchProgramIndicators,
        ]
    )
}
