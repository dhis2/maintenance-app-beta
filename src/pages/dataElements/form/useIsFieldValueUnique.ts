import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import memoize from 'lodash/memoize'
import { useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Pager } from '../../../types/generated'

const HAS_FIELD_VALUE_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: (variables: Record<string, string>) => {
            const filter = [`${variables.field}:eq:${variables.value}`]

            if (variables.id) {
                filter.push(`id:ne:${variables.id}`)
            }

            return { pageSize: 1, fields: 'id', filter }
        },
    },
}

interface QueryResponse {
    dataElements: {
        pager: Pager
    }
}

export function useIsFieldValueUnique({
    field,
    id,
}: {
    field: string
    id: string
}) {
    const engine = useDataEngine()

    const validate = useMemo(
        () =>
            memoize(async (value?: string) => {
                if (!value) {
                    return undefined
                }

                const data = (await engine.query(HAS_FIELD_VALUE_QUERY, {
                    variables: { field, value, id },
                })) as unknown as QueryResponse

                if (data.dataElements.pager.total > 0) {
                    return i18n.t(
                        'This field requires a unique value, please choose another one'
                    )
                }
            }),
        [field, engine, id]
    )

    return useDebouncedCallback(validate, 200, { leading: true })
}
