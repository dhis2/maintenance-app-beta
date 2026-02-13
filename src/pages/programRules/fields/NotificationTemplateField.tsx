import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type TemplateModel = { id: string; displayName?: string }

const PROGRAM_TEMPLATES_QUERY = (programId: string) => ({
    resource: 'programs' as const,
    id: programId,
    params: {
        fields: [
            'notificationTemplates[id,displayName]',
            'programStages[notificationTemplates[id,displayName]]',
        ],
        paging: false,
    },
})

export function NotificationTemplateField({
    programId,
    required,
}: Readonly<{
    programId: string
    required?: boolean
}>) {
    const queryFn = useBoundResourceQueryFn()

    const query = useMemo(() => PROGRAM_TEMPLATES_QUERY(programId), [programId])
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{
            notificationTemplates?: TemplateModel[]
            programStages?: Array<{
                notificationTemplates?: TemplateModel[]
            }>
        }>,
    })
    const { data } = queryResult

    const available = useMemo(() => {
        const fromProgram = data?.notificationTemplates ?? []
        const fromStages =
            data?.programStages?.flatMap(
                (s) => s.notificationTemplates ?? []
            ) ?? []
        const all: TemplateModel[] = [...fromProgram, ...fromStages]
        return [...new Map(all.map((t) => [t.id, t])).values()]
    }, [data])

    return (
        <Field
            name="notificationTemplate"
            format={(value: TemplateModel | undefined) =>
                value ? available.find((t) => t.id === value.id) : undefined
            }
            parse={(value: TemplateModel | undefined) => value || undefined}
        >
            {({ input, meta }) => {
                return (
                    <UIField
                        label={i18n.t('Message template')}
                        required={required}
                        error={meta.invalid}
                        validationText={
                            (meta.touched && meta.error?.toString()) || ''
                        }
                    >
                        <Box width="400px" minWidth="100px">
                            <BaseModelSingleSelect<TemplateModel>
                                selected={input.value}
                                available={available}
                                onChange={(value) => {
                                    input.onChange(value ?? undefined)
                                    input.onBlur()
                                }}
                                invalid={meta.touched && !!meta.error}
                                onRetryClick={queryResult.refetch}
                                showEndLoader={false}
                                loading={queryResult.isLoading}
                            />
                        </Box>
                    </UIField>
                )
            }}
        </Field>
    )
}
