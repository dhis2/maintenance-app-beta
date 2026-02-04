import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'
import {
    DataElementWithOptionSet,
    ProgramRuleActionFormValues,
} from '../fieldTypes'
import { NO_VALUE_OPTION } from '../ProgramRuleActionForm'

/**
 * Data element select; disabled when TEA is selected and clears TEA on change.
 * Acceptance criteria: at most one of data element or tracked entity attribute.
 */
export function DataElementSelect({
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

    const currentValue = (values as ProgramRuleActionFormValues).dataElement
    const selectedId = currentValue?.id
    const selectedInList =
        selectedId && elements.some((e) => e.id === selectedId)

    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            // Include current value in options when not in list (e.g. not yet loaded or removed from program) so SingleSelect does not throw
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

    const disabled = !!(values as ProgramRuleActionFormValues)
        .trackedEntityAttribute?.id

    const { input, meta } = useField(name, {
        format: (value: { id: string; displayName?: string } | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? elements.find((e) => e.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('trackedEntityAttribute', undefined)
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
 * Data element with option set select; filters to only elements with option sets.
 * Used for HIDEOPTION and SHOWOPTIONGROUP/HIDEOPTIONGROUP actions.
 */
export function DataElementWithOptionSetSelect({
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

    const currentValue = (values as ProgramRuleActionFormValues).dataElement
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

    const disabled = !!(values as ProgramRuleActionFormValues)
        .trackedEntityAttribute?.id

    const { input, meta } = useField(name, {
        format: (value: DataElementWithOptionSet | undefined) =>
            value?.id ?? '',
        parse: (id: string) =>
            id ? elements.find((e) => e.id === id) : undefined,
    })

    return (
        <SingleSelectFieldFF
            input={
                {
                    ...input,
                    onChange: (value: unknown) => {
                        if (value) {
                            form.change('trackedEntityAttribute', undefined)
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
