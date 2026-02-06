import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

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

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageDataElements[dataElement[id,displayName,optionSet[id]]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageDataElements?: Array<{
                    dataElement: {
                        id: string
                        displayName?: string
                        optionSet?: { id: string }
                    }
                }>
            }>
        }>,
    })

    const elements = useMemo(() => {
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

    const currentValue = (values as any).dataElement
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && elements.some((e) => e.id === selectedId)

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
            ...elements.map((de) => ({
                value: de.id,
                label: de.displayName ?? de.id,
            })),
        ],
        [elements, selectedId, selectedInList, currentValue?.displayName]
    )

    const disabled = !!(values as any).trackedEntityAttribute?.id

    return (
        <Field
            name="dataElement"
            format={(value: any) => value?.id ?? ''}
            parse={(id: string) =>
                id ? elements.find((e) => e.id === id) : undefined
            }
        >
            {({ input, meta, ...rest }) => {
                const showErrorAsTouched =
                    meta.touched || (!!meta.submitFailed && !!meta.error)

                return (
                    <SingleSelectFieldFF
                        input={
                            {
                                ...input,
                                onChange: (value: unknown) => {
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
                                },
                            } as typeof input
                        }
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
