import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'
import {
    ProgramRuleActionFormValues,
    TrackedEntityAttributeWithOptionSet,
} from '../fieldTypes'
import { NO_VALUE_OPTION } from '../ProgramRuleActionForm'

/**
 * Tracked entity attribute select; disabled when data element is selected and clears data element on change.
 * Acceptance criteria: at most one of data element or tracked entity attribute.
 */
export function TrackedEntityAttributeSelect({
    programId,
    name,
    label,
}: Readonly<{
    programId: string
    name: string
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

    const currentValue = (values as ProgramRuleActionFormValues)
        .trackedEntityAttribute
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

    const disabled = !!(values as ProgramRuleActionFormValues).dataElement?.id

    const { input, meta } = useField(name, {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? attributes.find((a) => a.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('dataElement', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}

/**
 * Tracked entity attribute with option set select; filters to only attributes with option sets.
 * Used for HIDEOPTION and SHOWOPTIONGROUP/HIDEOPTIONGROUP actions.
 */
export function TrackedEntityAttributeWithOptionSetSelect({
    programId,
    name,
    label,
}: Readonly<{
    programId: string
    name: string
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

    const currentValue = (values as ProgramRuleActionFormValues)
        .trackedEntityAttribute
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

    const disabled = !!(values as ProgramRuleActionFormValues).dataElement?.id

    const { input, meta } = useField(name, {
        format: (value: TrackedEntityAttributeWithOptionSet | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? attributes.find((a) => a.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('dataElement', undefined)
                            form.change('option', undefined)
                            form.change('optionGroup', undefined)
                        }
                        input.onChange(value)
                    },
                } as typeof input
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            dataTest={`program-rule-action-${name}`}
            disabled={disabled}
            filterable
        />
    )
}
