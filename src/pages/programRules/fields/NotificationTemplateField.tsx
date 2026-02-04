import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

export function NotificationTemplateField({
    programId,
    required,
}: Readonly<{
    programId: string
    required?: boolean
}>) {
    const queryFn = useBoundResourceQueryFn()

    const { data: programData } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'notificationTemplates[id,displayName]',
                        'programStages[notificationTemplates[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            notificationTemplates?: Array<{ id: string; displayName?: string }>
            programStages?: Array<{
                notificationTemplates?: Array<{
                    id: string
                    displayName?: string
                }>
            }>
        }>,
    })

    const templates = useMemo(() => {
        const fromProgram = programData?.notificationTemplates ?? []
        const fromStages =
            programData?.programStages?.flatMap(
                (s) => s.notificationTemplates ?? []
            ) ?? []
        const all = [...fromProgram, ...fromStages]
        const seen = new Set<string>()
        return all.filter((t) => {
            if (seen.has(t.id)) {
                return false
            }
            seen.add(t.id)
            return true
        })
    }, [programData])

    const selectOptions = useMemo(
        () =>
            templates.map((t) => ({
                value: t.id,
                label: t.displayName ?? t.id,
            })),
        [templates]
    )

    const { input, meta } = useField('templateUid', {
        format: (value: string | undefined) => value ?? '',
        parse: (value: string) => value || undefined,
    })

    return (
        <SingleSelectFieldFF
            input={input as any}
            meta={meta as any}
            label={i18n.t('Message template')}
            options={selectOptions}
            required={required}
            filterable
        />
    )
}
