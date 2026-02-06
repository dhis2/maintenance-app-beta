import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

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

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,optionSet[id]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: {
                    id: string
                    displayName?: string
                    optionSet?: { id: string }
                }
            }>
        }>,
    })

    const attributes = useMemo(() => {
        const list =
            data?.programTrackedEntityAttributes?.map(
                (pta) => pta.trackedEntityAttribute
            ) ?? []
        return list.filter((a) => a.optionSet?.id)
    }, [data])

    const currentValue = (values as any).trackedEntityAttribute
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && attributes.some((a) => a.id === selectedId)

    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...(selectedId && !selectedInList
                ? [
                      {
                          value: selectedId,
                          label:
                              currentValue?.displayName ?? i18n.t('Loading...'),
                      },
                  ]
                : []),
            ...attributes.map((a) => ({
                value: a.id,
                label: a.displayName ?? a.id,
            })),
        ],
        [attributes, selectedId, selectedInList, currentValue?.displayName]
    )

    const disabled = !!(values as any).dataElement?.id

    return (
        <Field
            name="trackedEntityAttribute"
            format={(value: any) => value?.id ?? ''}
            parse={(id: string) =>
                id ? attributes.find((a) => a.id === id) : undefined
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
                                if (value) {
                                    form.change('dataElement', undefined)
                                    form.change('option', undefined)
                                    form.change('optionGroup', undefined)
                                }
                                input.onChange(value)
                                input.onBlur()
                            },
                        }}
                        meta={{
                            ...meta,
                            touched: showErrorAsTouched,
                        }}
                        label={label}
                        options={selectOptions}
                        disabled={disabled}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
