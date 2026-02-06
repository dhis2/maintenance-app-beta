import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

const NO_VALUE_OPTION = { value: '', label: i18n.t('(No Value)') }

export function ProgramRuleVariableField({
    programId,
}: Readonly<{ programId: string }>) {
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
            format={(value: string | undefined) => value ?? ''}
            parse={(id: string) => id || undefined}
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
                        }}
                        label={i18n.t('Program rule variable to assign to')}
                        options={selectOptions}
                        filterable
                        {...rest}
                    />
                )
            }}
        </Field>
    )
}
