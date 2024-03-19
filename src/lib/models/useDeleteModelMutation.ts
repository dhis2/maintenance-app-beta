import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import { useMutation, UseMutationOptions } from 'react-query'
import { ImportSummary } from '../../types'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    id: string
    displayName: string
}

type DeleteMutationError = Omit<FetchError, 'details'> & {
    details: ImportSummary
}

type Options = Omit<
    UseMutationOptions<ImportSummary, DeleteMutationError, MutationFnArgs>,
    'mutationFn'
>

export function useDeleteModelMutation(schema: Schema, options?: Options) {
    const engine = useDataEngine()

    return useMutation({
        ...options,
        mutationFn: (variables) => {
            return engine.mutate({
                resource: schema.plural,
                id: variables.id,
                type: 'delete',
            }) as Promise<ImportSummary>
        },
    })
}
