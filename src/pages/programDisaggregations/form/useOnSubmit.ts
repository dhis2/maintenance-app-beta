import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { omitBy } from 'lodash'
import isEqual from 'lodash/isEqual'
import React, { useMemo } from 'react'
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
    deletedProgramIndicatorMappings,
}: ProgramDisaggregationFormValues): ProgramDisaggregationFormValues => {
    const deletedCategorySet = new Set(deletedCategories)
    const deletedPISet = new Set(deletedProgramIndicatorMappings)
    // remove soft-deleted
    const cleanedCategoryMappings = Object.fromEntries(
        Object.entries(categoryMappings).filter(
            ([categoryId]) => !deletedCategorySet.has(categoryId)
        )
    )

    // remove references to deleted mappings (note: you cannot delete all mappings through UI)
    for (const cat in cleanedCategoryMappings) {
        cleanedCategoryMappings[cat] = cleanedCategoryMappings[cat].filter(
            (individualMapping) => !individualMapping.deleted
        )
    }

    const categoryMappingsSet = new Set(
        Object.values(cleanedCategoryMappings).flatMap((categoryMapping) =>
            categoryMapping.map((cm) => cm.id)
        )
    )
    // remove references to mappings that are deleted
    const cleanedProgramIndicatorMappings = Object.fromEntries(
        Object.entries(programIndicatorMappings)
            .filter(([piId]) => !deletedPISet.has(piId))
            .map(([programIndicatorId, programIndicator]) => {
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
            })
    )
    return {
        categoryMappings: cleanedCategoryMappings,
        deletedCategories: deletedCategories,
        programIndicatorMappings: cleanedProgramIndicatorMappings,
        deletedProgramIndicatorMappings: deletedProgramIndicatorMappings,
    }
}
// type ProgramDisaggregationFormValues = Zod.infer<typeof schema>
export const useOnSubmit = (
    programId: string,
    initialValues: ProgramDisaggregationFormValues,
    closeOnSubmitRef: React.MutableRefObject<boolean>
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
            if (isEqual(values, initialValues)) {
                saveAlert.show({
                    message: i18n.t('No changes to save'),
                    options: { warning: true },
                })
                return
            }

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
                            .join(' - ')}`,
                        {
                            nsSeparator: '~-~',
                        }
                    ),
                    error: true,
                })
                return
            }

            // SUCCESS
            saveAlert.show({
                message: i18n.t('Saved successfully'),
                success: true,
            })

            // Only navigate when Save & Close was clicked
            if (closeOnSubmitRef.current) {
                navigate(`/${SECTIONS_MAP.programDisaggregation.namePlural}`)
            }
        },
        [
            saveAlert,
            navigate,
            patchPrograms,
            initialValues,
            patchProgramIndicators,
            closeOnSubmitRef,
        ]
    )
}
