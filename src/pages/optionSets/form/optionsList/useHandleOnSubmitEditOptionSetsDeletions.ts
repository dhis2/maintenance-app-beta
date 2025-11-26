import i18n from '@dhis2/d2-i18n'
import { QueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createFormError } from '../../../../lib'
import { DataEngine, ModelSection } from '../../../../types'

/* eslint-disable max-params */
export const useHandleOnSubmitEditOptionSetsDeletions = (
    section: ModelSection,
    optionsFieldName: string,
    dataEngine: DataEngine,
    queryClient: QueryClient,
    modelId: string
) => {
    /* eslint-enable max-params */
    return useMemo(
        () => async (options: { id: string; deleted?: boolean }[]) => {
            const optionsToDelete = options.filter((opt) => opt?.deleted)

            const deletionRoundOneResults = await Promise.allSettled(
                optionsToDelete.map((s) =>
                    dataEngine.mutate({
                        resource: `optionSets/${modelId}/options/`,
                        id: s.id,
                        type: 'delete',
                    })
                )
            )

            const deletionRoundTwoResults = await Promise.allSettled(
                optionsToDelete.map((s) =>
                    dataEngine.mutate({
                        resource: optionsFieldName,
                        id: s.id,
                        type: 'delete',
                    })
                )
            )

            const failuresOne = deletionRoundOneResults
                .map((deletion, i) => ({
                    ...deletion,
                    optionId: optionsToDelete[i].id,
                    type: 'section',
                }))
                .filter((deletion) => deletion.status === 'rejected')
            const failuresTwo = deletionRoundTwoResults
                .map((deletion, i) => ({
                    ...deletion,
                    optionId: optionsToDelete[i].id,
                    type: 'section',
                }))
                .filter((deletion) => deletion.status === 'rejected')
            const failures = [...failuresOne, ...failuresTwo]

            if (failures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: section.namePlural }],
                })
                return {
                    error: createFormError({
                        message: i18n.t(
                            'There was an error deleting options: {{optionIds}}',
                            {
                                optionIds: failures
                                    .map((f) => f.optionId)
                                    .join(', '),
                                nsSeparator: '~-~',
                            }
                        ),
                        errors: failures.map((f) => f.reason.message),
                    }),
                }
            }

            return {}
        },
        [dataEngine, queryClient, section, optionsFieldName, modelId]
    )
}
