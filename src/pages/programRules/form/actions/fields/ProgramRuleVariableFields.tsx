import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../../../lib'
import { NO_VALUE_OPTION } from '../ProgramRuleActionForm'

/**
 * Program rule variable select for ASSIGN action.
 * Allows assigning to a program rule variable instead of a data element or tracked entity attribute.
 */
export function ProgramRuleVariableSelect({
    programId,
}: {
    programId: string
}) {
    const queryFn = useBoundResourceQueryFn()

    const { data } = useQuery({
        queryKey: [
            {
                resource: 'programRuleVariables',
                params: {
                    fields: ['id', 'displayName'],
                    filter: `program.id:eq:${programId}`,
                    paging: false,
                },
            },
        ] as const,
        queryFn: queryFn<{
            programRuleVariables?: Array<{ id: string; displayName?: string }>
        }>,
    })

    const variables = useMemo(() => data?.programRuleVariables ?? [], [data])

    const selectOptions = useMemo(
        () => [
            NO_VALUE_OPTION,
            ...variables.map((v) => ({
                value: v.id,
                label: v.displayName ?? v.id,
            })),
        ],
        [variables]
    )

    return (
        <Field
            name="content"
            label={i18n.t('Program rule variable to assign to')}
            component={SingleSelectFieldFF as any}
            options={selectOptions}
            dataTest="program-rule-action-program-rule-variable"
            format={(value: string | undefined) => value ?? ''}
            parse={(id: string) => id || undefined}
            filterable
        />
    )
}
