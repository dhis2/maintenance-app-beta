import { useDataEngine } from '@dhis2/app-runtime'
import { FORM_ERROR } from 'final-form'
import { useCallback } from 'react'

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
                return { response }
            } catch (error) {
                return { [FORM_ERROR]: (error as Error | string).toString() }
            }
        },
        [dataEngine, resource]
    )
    return create
}
