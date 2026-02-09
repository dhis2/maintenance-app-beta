import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type DataElementWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}

const PROGRAM_DATA_ELEMENTS_OPTION_SET_QUERY = (programId: string) => ({
    resource: 'programs' as const,
    id: programId,
    params: {
        fields: [
            'programStages[programStageDataElements[dataElement[id,displayName,optionSet[id]]]]',
        ],
        paging: false,
    },
})

export function DataElementWithOptionSetField({
    programId,
    label,
}: Readonly<{
    programId: string
    label: string
}>) {
    const form = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()

    const query = useMemo(
        () => PROGRAM_DATA_ELEMENTS_OPTION_SET_QUERY(programId),
        [programId]
    )
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{
            programStages?: Array<{
                programStageDataElements?: Array<{
                    dataElement: DataElementWithOptionSet
                }>
            }>
        }>,
    })
    const { data } = queryResult

    const available = useMemo(() => {
        const list =
            data?.programStages?.flatMap(
                (s) =>
                    s.programStageDataElements?.map(
                        (psde) => psde.dataElement
                    ) ?? []
            ) ?? []
        const withOptionSet = list.filter((de) => de.optionSet?.id)
        const seen = new Set<string>()
        return withOptionSet.filter((de) => {
            if (seen.has(de.id)) {
                return false
            }
            seen.add(de.id)
            return true
        })
    }, [data])

    const formValues = values as { trackedEntityAttribute?: { id: string } }
    const disabled = !!formValues.trackedEntityAttribute?.id

    return (
        <Field
            name="dataElement"
            format={(value: DataElementWithOptionSet | undefined) =>
                value ?? undefined
            }
            parse={(value: DataElementWithOptionSet | undefined) => value}
        >
            {({ input, meta }) => (
                <UIField
                    label={label}
                    disabled={disabled}
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
                                if (value) {
                                    form.change(
                                        'trackedEntityAttribute',
                                        undefined
                                    )
                                    form.change('option', undefined)
                                    form.change('optionGroup', undefined)
                                }
                                input.onChange(value)
                                input.onBlur()
                            }}
                            showNoValueOption={{
                                value: '',
                                label: i18n.t('(No Value)'),
                            }}
                            disabled={disabled}
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
