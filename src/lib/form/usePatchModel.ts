import { useDataEngine } from '@dhis2/app-runtime'
import { FORM_ERROR } from 'final-form'
import { useCallback, useState } from 'react'
import { JsonPatchOperation } from '../../types'

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
                await dataEngine.mutate(query, {
                    variables: { operations },
                })
            } catch (error) {
                return { [FORM_ERROR]: (error as Error | string).toString() }
            }
        },
        [dataEngine, query]
    )

    return patch
}
