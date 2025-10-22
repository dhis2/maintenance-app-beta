import i18n from '@dhis2/d2-i18n'
import { QueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createFormError } from '../../lib'
import { DataEngine, ModelSection } from '../../types'
import { Section } from '../formCreators/SectionFormList'

const getErrorMessage = (failures: string[]): string => {
    const customFormFailure = failures.slice(-1)?.[0] === 'customForm'
    const sectionFailures = customFormFailure
        ? failures.length > 1
        : failures.length > 0
    if (customFormFailure && !sectionFailures) {
        return 'There was an error deleting the custom form'
    }
    if (!customFormFailure && sectionFailures) {
        return 'There was an error deleting sections: {{sectionNames}}'
    }
    return 'There was an error deleting the custom form and sections: {{sectionNames}}'
}
export const useHandleOnSubmitEditFormDeletions = (
    section: ModelSection,
    sectionsFieldName: string,
    dataEngine: DataEngine,
    queryClient: QueryClient
) => {
    return useMemo(
        () =>
            async (
                sections: Section[],
                dataEntryForm:
                    | {
                          id: string
                          deleted?: boolean
                      }
                    | undefined
            ) => {
                const sectionsToDelete = sections.filter((s) => s.deleted)

                const customFormDeleteResult =
                    dataEntryForm?.deleted &&
                    (await Promise.allSettled([
                        dataEngine.mutate({
                            resource: 'dataEntryForms',
                            id: dataEntryForm.id,
                            type: 'delete',
                        }),
                    ]))

                const deletionResults = await Promise.allSettled(
                    sectionsToDelete.map((s) =>
                        dataEngine.mutate({
                            resource: sectionsFieldName,
                            id: s.id,
                            type: 'delete',
                        })
                    )
                )

                const failures = deletionResults
                    .map((deletion, i) => ({
                        ...deletion,
                        sectionName: sectionsToDelete[i].displayName,
                        type: 'section',
                    }))
                    .filter((deletion) => deletion.status === 'rejected')

                if (
                    customFormDeleteResult &&
                    customFormDeleteResult?.[0]?.status === 'rejected'
                ) {
                    failures.push({
                        ...customFormDeleteResult[0],
                        sectionName: '',
                        type: 'customForm',
                    })
                }

                if (failures.length > 0) {
                    await queryClient.invalidateQueries({
                        queryKey: [{ resource: section.namePlural }],
                    })
                    return {
                        error: createFormError({
                            message: i18n.t(
                                getErrorMessage(failures.map((f) => f.type)),
                                {
                                    sectionNames: failures
                                        .map((f) => f.sectionName)
                                        .join(', '),
                                    nsSeparator: '~-~',
                                }
                            ),
                            errors: failures.map((f) => f.reason.message),
                        }),
                    }
                }

                return { customFormDeleteResult }
            },
        [dataEngine, queryClient, section, sectionsFieldName]
    )
}
