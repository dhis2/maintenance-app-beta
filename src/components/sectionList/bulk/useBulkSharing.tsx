import { useConfig, useDataEngine, useDataMutation } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { JsonPatchOperation, SchemaName } from '../../../types'

type Mutation = Parameters<typeof useDataMutation>[0]

const query = {
    type: 'json-patch',
    data: ({ data }: Record<string, string>) => data,
} as const

const createQuery = (modelName: string): Mutation => ({
    ...query,
    resource: modelName,
    id: 'sharing',
})

export type SharingJsonPatchOperation = Omit<JsonPatchOperation, 'value'> & {
    value?: {
        access: string
        id: string
    }
}

export const useBulkSharingMutation = ({
    modelNamePlural,
}: {
    modelNamePlural: string
}) => {
    const config = useConfig()

    const updateSharing = useCallback(
        (modelIds: string[], operations: SharingJsonPatchOperation[]) => {
            const data = {
                [modelNamePlural]: modelIds,
                patch: operations,
            }

            // engine.mutate enforces body to be an array, which does not match the API
            // so we cant use engine for this mutation
            const request = fetch(
                `${config.baseUrl}/api/${modelNamePlural}/sharing`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json-patch+json',
                        Accept: 'application/json',
                        // credentials: 'include',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    method: 'PATCH',
                    body: JSON.stringify(data),
                }
            )
            return request.then((r) => (r.ok ? r.json() : Promise.reject(r)))
        },
        [config, modelNamePlural]
    )

    return updateSharing
}
