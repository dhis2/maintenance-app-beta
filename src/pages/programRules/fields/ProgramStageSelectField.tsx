import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type ProgramStageModel = { id: string; displayName?: string }

const PROGRAM_STAGES_QUERY = (programId: string) => ({
    resource: 'programStages' as const,
    params: {
        fields: ['id', 'displayName'],
        filter: `program.id:eq:${programId}`,
        paging: false,
    },
})

export function ProgramStageSelectField({
    programId,
    label,
    required,
}: Readonly<{
    programId: string
    label?: string
    required?: boolean
}>) {
    const queryFn = useBoundResourceQueryFn()

    const query = useMemo(() => PROGRAM_STAGES_QUERY(programId), [programId])
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{ programStages?: ProgramStageModel[] }>,
    })
    const { data } = queryResult

    const available = useMemo(() => data?.programStages ?? [], [data])

    return (
        <Field
            name="programStage"
            format={(value: ProgramStageModel | undefined) =>
                value ?? undefined
            }
            parse={(value: ProgramStageModel | undefined) => value}
        >
            {({ input, meta }) => (
                <UIField
                    label={label ?? i18n.t('Program stage')}
                    required={required}
                    error={meta.invalid}
                    validationText={
                        (meta.touched && meta.error?.toString()) || ''
                    }
                >
                    <Box width="400px" minWidth="100px">
                        <BaseModelSingleSelect<ProgramStageModel>
                            selected={input.value}
                            available={available}
                            onChange={(value) => {
                                input.onChange(value)
                                input.onBlur()
                            }}
                            showNoValueOption={{
                                value: '',
                                label: i18n.t('(No Value)'),
                            }}
                            invalid={meta.touched && !!meta.error}
                            onRetryClick={queryResult.refetch}
                            showEndLoader={false}
                            loading={queryResult.isLoading}
                        />
                    </Box>
                </UIField>
            )}
        </Field>
    )
}
