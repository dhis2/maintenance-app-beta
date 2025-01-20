import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ImportSummary } from '../../types'

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

export function useDeleteModelMutation(
    schemaResource: string,
    options?: Options
) {
    const engine = useDataEngine()

    return useMutation({
        ...options,
        mutationFn: (variables) => {
            return engine.mutate({
                resource: schemaResource,
                id: variables.id,
                type: 'delete',
            }) as Promise<ImportSummary>
        },
    })
}
