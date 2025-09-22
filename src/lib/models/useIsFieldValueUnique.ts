import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import memoize from 'lodash/memoize'
import { useCallback, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Pager } from '../../types/generated'

interface QueryResponse {
    result: {
        pager: Pager
    }
}

export function useIsFieldValueUnique({
    model,
    field,
    id,
    message,
}: {
    model: string
    field: string
    id?: string
    message?: string
}) {
    const [HAS_FIELD_VALUE_QUERY] = useState({
        result: {
            resource: model,
            params: (variables: Record<string, string>) => {
                const equalOperation = !isNaN(Number(variables.value.trim()))
                    ? 'eq'
                    : 'ieq'
                const filter = [
                    `${
                        variables.field
                    }:${equalOperation}:${variables.value.trim()}`,
                ]

                if (variables.id) {
                    filter.push(`id:ne:${variables.id}`)
                }

                return { pageSize: 1, fields: 'id', filter }
            },
        },
    })
    const engine = useDataEngine()

    const memoized = useMemo(
        () =>
            memoize(async (value?: string) => {
                if (!value) {
                    return undefined
                }

                const data = (await engine.query(HAS_FIELD_VALUE_QUERY, {
                    variables: { field, value, id },
                })) as unknown as QueryResponse

                if (data.result.pager.total > 0) {
                    return (
                        message ??
                        i18n.t(
                            'This field requires a unique value, please choose another one'
                        )
                    )
                }
            }),
        [field, engine, id, HAS_FIELD_VALUE_QUERY, message]
    )

    // Doing it this way to prevent extra arguments to be passed.
    // The "allValues" argument changes for every changed value and therefore
    // circumvents memoization
    const validate = useCallback(
        (value?: string) => memoized(value),
        [memoized]
    )

    return useDebouncedCallback(validate, 200, { leading: true })
}
