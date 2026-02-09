import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type TEAWithOptionSet = {
    id: string
    displayName?: string
    optionSet?: { id: string }
}

const PROGRAM_TEAS_OPTION_SET_QUERY = (programId: string) => ({
    resource: 'programs' as const,
    id: programId,
    params: {
        fields: [
            'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,optionSet[id]]]',
        ],
        paging: false,
    },
})

export function TrackedEntityAttributeWithOptionSetField({
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
        () => PROGRAM_TEAS_OPTION_SET_QUERY(programId),
        [programId]
    )
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: TEAWithOptionSet
            }>
        }>,
    })
    const { data } = queryResult

    const available = useMemo(() => {
        const list =
            data?.programTrackedEntityAttributes?.map(
                (pta) => pta.trackedEntityAttribute
            ) ?? []
        const withOptionSet = list.filter((a) => a.optionSet?.id)
        return [...new Map(withOptionSet.map((a) => [a.id, a])).values()]
    }, [data])

    const disabled = !!values.dataElement?.id

    return (
        <Field
            name="trackedEntityAttribute"
            format={(value: TEAWithOptionSet | undefined) => value ?? undefined}
            parse={(value: TEAWithOptionSet | undefined) => value}
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
                                    form.change('dataElement', undefined)
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
