import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

export function ProgramStageSectionField({
    programId,
    required,
}: Readonly<{
    programId: string
    required?: boolean
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
                        'programStages[programStageSections[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programStages?: Array<{
                programStageSections?: Array<{
                    id: string
                    displayName?: string
                }>
            }>
        }>,
    })

    const sections = useMemo(() => {
        const list =
            data?.programStages?.flatMap((s) => s.programStageSections ?? []) ??
            []
        const seen = new Set<string>()
        return list.filter((s) => {
            if (seen.has(s.id)) {
                return false
            }
            seen.add(s.id)
            return true
        })
    }, [data])

    const currentValue = (values as any).programStageSection
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && sections.some((s) => s.id === selectedId)

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
            ...sections.map((s) => ({
                value: s.id,
                label: s.displayName ?? s.id,
            })),
        ],
        [sections, selectedId, selectedInList, currentValue?.displayName]
    )

    return (
        <Field
            name="programStageSection"
            format={(value: { id: string; displayName?: string } | undefined) =>
                value?.id ?? ''
            }
            parse={(id: string) =>
                id ? sections.find((s) => s.id === id) : undefined
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
                        meta={{
                            ...meta,
                            touched: showErrorAsTouched,
                            initial: meta.initial?.id,
                        }}
                        label={i18n.t('Program stage section to hide')}
                        options={selectOptions}
                        required={required}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
