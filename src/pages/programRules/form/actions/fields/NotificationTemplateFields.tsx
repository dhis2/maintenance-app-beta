import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'

/**
 * Notification template select for SENDMESSAGE and SCHEDULEMESSAGE actions.
 * Fetches templates from both the program and its stages.
 */
export function NotificationTemplateSelect({
    programId,
    required,
}: {
    programId: string
    required?: boolean
}) {
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

    const options = useMemo(() => {
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
            options.map((t) => ({ value: t.id, label: t.displayName ?? t.id })),
        [options]
    )

    return (
        <Field
            name="templateUid"
            label={i18n.t('Message template')}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            required={required}
            dataTest="program-rule-action-notification-template"
            filterable
        />
    )
}
