import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
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

    return (
        <Field
            name="templateUid"
            format={(value: string | undefined) => value ?? ''}
            parse={(value: string) => value || undefined}
            validate={
                required
                    ? (value: string | undefined) =>
                          !value ? i18n.t('This field is required') : undefined
                    : undefined
            }
        >
            {({ input, meta, ...rest }) => {
                const showErrorAsTouched =
                    meta.touched || (!!meta.submitFailed && !!meta.error)

                return (
                    <SingleSelectFieldFF
                        input={{
                            ...input,
                            onChange: (value: unknown) => {
                                input.onChange(value)
                                input.onBlur()
                            },
                        }}
                        meta={
                            {
                                ...meta,
                                touched: showErrorAsTouched,
                            } as any
                        }
                        label={i18n.t('Message template')}
                        options={selectOptions}
                        required={required}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
