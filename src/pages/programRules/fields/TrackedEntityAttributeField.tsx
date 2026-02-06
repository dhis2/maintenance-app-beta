import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

export function TrackedEntityAttributeField({
    programId,
    label,
    required,
    validateField,
    disableIfOtherFieldSet,
}: Readonly<{
    programId: string
    label: string
    required?: boolean
    validateField?: (value: any, allValues: any) => string | undefined
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
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]',
                    ],
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programTrackedEntityAttributes?: Array<{
                trackedEntityAttribute: { id: string; displayName?: string }
            }>
        }>,
    })

    const attributes = useMemo(
        () =>
            data?.programTrackedEntityAttributes?.map(
                (pta) => pta.trackedEntityAttribute
            ) ?? [],
        [data]
    )

    const currentValue = (values as any).trackedEntityAttribute
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && attributes.some((a) => a.id === selectedId)

    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            // Include current value in options when not in list so SingleSelect does not throw
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

    const disabled = disableIfOtherFieldSet
        ? !!(values as Record<string, { id?: string } | undefined>)[
              disableIfOtherFieldSet
          ]?.id
        : false

    const requiredValidator = (
        value: { id: string; displayName?: string } | undefined
    ) => (value?.id ? undefined : i18n.t('This field is required'))

    return (
        <Field
            name="trackedEntityAttribute"
            format={(value: { id: string; displayName?: string } | undefined) =>
                value?.id ?? ''
            }
            parse={(id: string) =>
                id ? attributes.find((a) => a.id === id) : undefined
            }
            validate={
                validateField ?? (required ? requiredValidator : undefined)
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
