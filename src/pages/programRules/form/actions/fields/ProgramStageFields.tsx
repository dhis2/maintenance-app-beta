import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'

/**
 * Program stage section select for HIDESECTION action.
 * Fetches all program stage sections from all stages within the program.
 */
export function ProgramStageSectionSelect({
    programId,
    label,
}: {
    programId: string
    label: string
}) {
    const queryFn = useBoundResourceQueryFn()

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageSections[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageSections?: Array<{
                    id: string
                    displayName?: string
                }>
            }>
        }>,
    })

    const sections = useMemo(() => {
        const list =
            data?.programStages?.flatMap((s) => s.programStageSections ?? []) ??
            []
        const seen = new Set<string>()
        return list.filter((s) => {
            if (seen.has(s.id)) {
                return false
            }
            seen.add(s.id)
            return true
        })
    }, [data])

    const selectOptions = useMemo(
        () =>
            sections.map((s) => ({
                value: s.id,
                label: s.displayName ?? s.id,
            })),
        [sections]
    )

    return (
        <Field
            name="programStageSection"
            label={label}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            required
            dataTest="program-rule-action-program-stage-section"
            filterable
        />
    )
}
