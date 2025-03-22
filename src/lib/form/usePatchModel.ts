import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { JsonPatchOperation } from '../../types'
import { parseErrorResponse } from '../errors'

const createPatchQuery = (id: string, resource: string) => {
    return {
        resource: resource,
        id: id,
        type: 'json-patch',
        data: ({ operations }: Record<string, string>) => operations,
    } as const
}

export const usePatchModel = (id: string, resource: string) => {
    const dataEngine = useDataEngine()
    const [query] = useState(() => createPatchQuery(id, resource))

    const patch = useCallback(
        async (operations: JsonPatchOperation[]) => {
            try {
                const response = await dataEngine.mutate(query, {
                    variables: { operations },
                })
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [dataEngine, query]
    )

    return patch
}
