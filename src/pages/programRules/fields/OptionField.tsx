import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type OptionModel = { id: string; displayName?: string }

function getOptionSetId(
    values: Record<string, { optionSet?: { id: string } } | undefined>
): string | undefined {
    const de = values.dataElement
    const tea = values.trackedEntityAttribute
    return de?.optionSet?.id ?? tea?.optionSet?.id
}

const OPTIONS_QUERY = (optionSetId: string) => ({
    resource: 'options' as const,
    params: {
        fields: ['id', 'displayName'],
        filter: [`optionSet.id:eq:${optionSetId}`],
        paging: false,
    },
})

export function OptionField({
    label,
    required,
}: Readonly<{
    label: string
    required?: boolean
}>) {
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()
    const optionSetId = getOptionSetId(
        values as Record<string, { optionSet?: { id: string } } | undefined>
    )

    const query = useMemo(
        () =>
            optionSetId
                ? OPTIONS_QUERY(optionSetId)
                : { resource: 'options' as const, params: {} },
        [optionSetId]
    )
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{ options?: OptionModel[] }>,
        enabled: !!optionSetId,
    })
    const { data } = queryResult

    const available = useMemo(() => data?.options ?? [], [data])
    const disabled = !optionSetId

    return (
        <Field
            name="option"
            format={(value: OptionModel | undefined) => value ?? undefined}
            parse={(value: OptionModel | undefined) => value}
        >
            {({ input, meta }) => (
                <UIField
                    label={label}
                    required={required}
                    error={meta.invalid}
                    validationText={
                        (meta.touched && meta.error?.toString()) || ''
                    }
                >
                    <Box width="400px" minWidth="100px">
                        <BaseModelSingleSelect<OptionModel>
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
