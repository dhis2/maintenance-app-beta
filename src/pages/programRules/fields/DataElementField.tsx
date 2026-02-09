import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

export function DataElementField({
    programId,
    label,
    required,
    disableIfOtherFieldSet,
}: Readonly<{
    programId: string
    label: string
    required?: boolean
    disableIfOtherFieldSet?: string
}>) {
    const { values } = useFormState({ subscription: { values: true } })
    const queryFn = useBoundResourceQueryFn()

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programs',
                id: programId,
                params: {
                    fields: [
                        'programStages[programStageDataElements[dataElement[id,displayName]]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageDataElements?: Array<{
                    dataElement: { id: string; displayName?: string }
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
        const seen = new Set<string>()
        return list.filter((de) => {
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
            // Include current value in options when not in list (e.g. not yet loaded or removed from program)
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

    const disabled = disableIfOtherFieldSet
        ? !!(values as Record<string, { id?: string } | undefined>)[
              disableIfOtherFieldSet
          ]?.id
        : false

    return (
        <Field
            name="dataElement"
            format={(value: { id: string; displayName?: string } | undefined) =>
                value?.id ?? ''
            }
            parse={(id: string) =>
                id ? elements.find((e) => e.id === id) : undefined
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
                            } as React.ComponentProps<
                                typeof SingleSelectFieldFF
                            >['meta']
                        }
                        label={label}
                        options={selectOptions}
                        required={required}
                        disabled={disabled}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
