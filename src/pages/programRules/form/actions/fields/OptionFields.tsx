import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'
import { ProgramRuleActionFormValues } from '../fieldTypes'

/**
 * Option select for HIDEOPTION action.
 * Fetches options from the option set associated with the selected data element or tracked entity attribute.
 */
export function OptionSelect({
    optionSetId,
    label,
    required,
}: {
    optionSetId: string | undefined
    label: string
    required?: boolean
}) {
    const queryFn = useBoundResourceQueryFn()

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
    const currentValue = (
        useFormState({ subscription: { values: true } })
            .values as ProgramRuleActionFormValues
    ).option
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

    const { input, meta } = useField('option', {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? options.find((o) => o.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                input as React.ComponentProps<
                    typeof SingleSelectFieldFF
                >['input']
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            disabled={!optionSetId}
            dataTest="program-rule-action-option"
            required={required}
            filterable
        />
    )
}

/**
 * Option group select for SHOWOPTIONGROUP/HIDEOPTIONGROUP actions.
 * Fetches option groups from the option set associated with the selected data element or tracked entity attribute.
 */
export function OptionGroupSelect({
    optionSetId,
    label,
    required,
}: {
    optionSetId: string | undefined
    label: string
    required?: boolean
}) {
    const queryFn = useBoundResourceQueryFn()

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
    const currentValue = (
        useFormState({ subscription: { values: true } })
            .values as ProgramRuleActionFormValues
    ).optionGroup
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
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? optionGroups.find((og) => og.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                input as React.ComponentProps<
                    typeof SingleSelectFieldFF
                >['input']
            }
            meta={
                meta as React.ComponentProps<typeof SingleSelectFieldFF>['meta']
            }
            label={label}
            options={selectOptions}
            disabled={!optionSetId}
            dataTest="program-rule-action-option-group"
            required={required}
            filterable
        />
    )
}
