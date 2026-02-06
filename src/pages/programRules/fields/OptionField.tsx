import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

function getOptionSetId(values: any): string | undefined {
    const de = values.dataElement
    const tea = values.trackedEntityAttribute
    return de?.optionSet?.id ?? tea?.optionSet?.id
}

export function OptionField({
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
                resource: 'options',
                params: {
                    fields: ['id', 'displayName'],
                    filter: optionSetId
                        ? [`optionSet.id:eq:${optionSetId}`]
                        : undefined,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            options?: Array<{ id: string; displayName?: string }>
        }>,
        enabled: !!optionSetId,
    })

    const options = useMemo(() => data?.options ?? [], [data])
    const currentValue = (values as any).option
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && options.some((o) => o.id === selectedId)

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
            ...options.map((o) => ({
                value: o.id,
                label: o.displayName ?? o.id,
            })),
        ],
        [options, selectedId, selectedInList, currentValue?.displayName]
    )

    type OptionValue = { id: string; displayName?: string } | undefined

    return (
        <Field<OptionValue, HTMLElement, string>
            name="option"
            format={(value: OptionValue) => value?.id ?? ''}
            parse={(id: string) =>
                id ? options.find((o) => o.id === id) : undefined
            }
            validate={
                required
                    ? (value: OptionValue) =>
                          !value?.id
                              ? i18n.t('This field is required')
                              : undefined
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
                        label={label}
                        options={selectOptions}
                        disabled={!optionSetId}
                        required={required}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
