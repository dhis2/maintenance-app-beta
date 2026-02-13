import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { useBoundResourceQueryFn } from '../../../lib'

type OptionGroupModel = { id: string; displayName?: string }

function getOptionSetId(
    values: Record<string, { optionSet?: { id: string } } | undefined>
): string | undefined {
    const de = values.dataElement
    const tea = values.trackedEntityAttribute
    return de?.optionSet?.id ?? tea?.optionSet?.id
}

const OPTION_GROUPS_QUERY = (optionSetId: string) => ({
    resource: 'optionGroups' as const,
    params: {
        fields: ['id', 'displayName'],
        filter: [`optionSet.id:eq:${optionSetId}`, 'name:neq:default'],
        paging: false,
    },
})

export function OptionGroupField({
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
                ? OPTION_GROUPS_QUERY(optionSetId)
                : { resource: 'optionGroups' as const, params: {} },
        [optionSetId]
    )
    const queryResult = useQuery({
        queryKey: [query],
        queryFn: queryFn<{ optionGroups?: OptionGroupModel[] }>,
        enabled: !!optionSetId,
    })
    const { data } = queryResult

    const available = useMemo(() => data?.optionGroups ?? [], [data])
    const disabled = !optionSetId

    return (
        <Field
            name="optionGroup"
            format={(value: OptionGroupModel | undefined) => value ?? undefined}
            parse={(value: OptionGroupModel | undefined) => value}
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
                        <BaseModelSingleSelect<OptionGroupModel>
                            selected={input.value}
                            available={available}
                            onChange={(value) => {
                                input.onChange(value)
                                input.onBlur()
                            }}
                            showNoValueOption={{
                                value: '',
                                label: i18n.t('<No value>'),
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
