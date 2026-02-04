import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

export function ProgramStageSelectField({
    programId,
    label,
    required,
}: Readonly<{
    programId: string
    label?: string
    required?: boolean
}>) {
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programStages',
                params: {
                    fields: ['id', 'displayName'],
                    filter: `program.id:eq:${programId}`,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{ id: string; displayName?: string }>
        }>,
    })

    const programStages = useMemo(() => data?.programStages ?? [], [data])

    const currentValue = (values as any).programStage
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && programStages.some((ps) => ps.id === selectedId)

    const selectOptions = useMemo(
        () => [
            // Include current value in options when not in list
            ...(selectedId && !selectedInList
                ? [
                      {
                          value: selectedId,
                          label:
                              currentValue?.displayName ?? i18n.t('Loading...'),
                      },
                  ]
                : []),
            ...programStages.map((ps) => ({
                value: ps.id,
                label: ps.displayName ?? ps.id,
            })),
        ],
        [programStages, selectedId, selectedInList, currentValue?.displayName]
    )

    const { input, meta } = useField('programStage', {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? programStages.find((ps) => ps.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={input as any}
            meta={meta as any}
            label={label || i18n.t('Program stage')}
            options={selectOptions}
            required={required}
            filterable
        />
    )
}
