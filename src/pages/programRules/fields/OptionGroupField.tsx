import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

function getOptionSetId(values: any): string | undefined {
    const de = values.dataElement
    const tea = values.trackedEntityAttribute
    return de?.optionSet?.id ?? tea?.optionSet?.id
}

export function OptionGroupField({
    label,
    required,
}: Readonly<{
    label: string
    required?: boolean
}>) {
    const queryFn = useBoundResourceQueryFn()
    const { values } = useFormState({ subscription: { values: true } })
    const optionSetId = getOptionSetId(values)

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'optionGroups',
                params: {
                    fields: ['id', 'displayName'],
                    filter: optionSetId
                        ? [`optionSet.id:eq:${optionSetId}`, 'name:neq:default']
                        : undefined,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            optionGroups?: Array<{ id: string; displayName?: string }>
        }>,
        enabled: !!optionSetId,
    })

    const optionGroups = useMemo(() => data?.optionGroups ?? [], [data])
    const currentValue = (values as any).optionGroup
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && optionGroups.some((og) => og.id === selectedId)

    const selectOptions = useMemo(
        () => [
            ...(selectedId && !selectedInList
                ? [
                      {
                          value: selectedId,
                          label:
                              currentValue?.displayName ?? i18n.t('Loading...'),
                      },
                  ]
                : []),
            ...optionGroups.map((og) => ({
                value: og.id,
                label: og.displayName ?? og.id,
            })),
        ],
        [optionGroups, selectedId, selectedInList, currentValue?.displayName]
    )

    const { input, meta } = useField('optionGroup', {
        format: (value: any) => value?.id ?? '',
        parse: (id: string) =>
            id ? optionGroups.find((og) => og.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={input as any}
            meta={meta as any}
            label={label}
            options={selectOptions}
            disabled={!optionSetId}
            required={required}
            filterable
        />
    )
}
