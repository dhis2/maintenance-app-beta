import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { parseErrorResponse } from '../errors'

export const useCreateModel = (resource: string) => {
    const dataEngine = useDataEngine()

    const create = useCallback(
        async (data: Record<string, unknown>) => {
            try {
                const response = await dataEngine.mutate({
                    resource,
                    type: 'create',
                    data: data,
                })
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [dataEngine, resource]
    )
    return create
}
