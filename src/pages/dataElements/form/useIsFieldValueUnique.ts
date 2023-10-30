import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { memoize } from '../../../lib'
import { Pager } from '../../../types/generated'

const HAS_FIELD_VALUE_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: (variables: Record<string, string>) => ({
            pageSize: 1,
            fields: 'id',
            filter: [`${variables.field}:eq:${variables.value}`],
        }),
    },
}

interface QueryResponse {
    dataElements: {
        pager: Pager
    }
}

export function useIsFieldValueUnique(field: string) {
    const engine = useDataEngine()

    const validate = useMemo(
        () =>
            memoize(async (value: string) => {
                if (!value) {
                    return undefined
                }

                const data = (await engine.query(HAS_FIELD_VALUE_QUERY, {
                    variables: { field, value },
                })) as unknown as QueryResponse

                if (data.dataElements.pager.total > 0) {
                    return i18n.t(
                        'This field requires a unique value, please choose another one'
                    )
                }
            }),
        [field, engine]
    )

    return useDebouncedCallback(validate, 200, { leading: true })
}
