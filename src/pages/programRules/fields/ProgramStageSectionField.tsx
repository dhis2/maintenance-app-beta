import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type SectionModel = { id: string; displayName?: string }

const PROGRAM_STAGE_SECTIONS_QUERY = (programId: string) => ({
    resource: 'programs' as const,
    id: programId,
    params: {
        fields: ['programStages[programStageSections[id,displayName]]'],
        paging: false,
    },
})

export function ProgramStageSectionField({
    programId,
    required,
}: Readonly<{
    programId: string
    required?: boolean
}>) {
    const queryFn = useBoundResourceQueryFn()

    const query = useMemo(
        () => PROGRAM_STAGE_SECTIONS_QUERY(programId),
        [programId]
    )
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{
            programStages?: Array<{
                programStageSections?: SectionModel[]
            }>
        }>,
    })
    const { data } = queryResult

    const available = useMemo(() => {
        const list =
            data?.programStages?.flatMap((s) => s.programStageSections ?? []) ??
            []
        return [...new Map(list.map((s) => [s.id, s])).values()]
    }, [data])

    return (
        <Field
            name="programStageSection"
            format={(value: SectionModel | undefined) => value ?? undefined}
            parse={(value: SectionModel | undefined) => value}
        >
            {({ input, meta }) => (
                <UIField
                    label={i18n.t('Program stage section to hide')}
                    required={required}
                    error={meta.invalid}
                    validationText={
                        (meta.touched && meta.error?.toString()) || ''
                    }
                >
                    <Box width="400px" minWidth="100px">
                        <BaseModelSingleSelect
                            selected={input.value}
                            available={available}
                            onChange={(value) => {
                                input.onChange(value)
                                input.onBlur()
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
