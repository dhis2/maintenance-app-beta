import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from 'react-query'

type MutationFnArgs = {
    id: string
    displayName: string
    messages?: string[]
}

type Options = Omit<Parameters<typeof useMutation>[1], 'mutationFn'>

export function useDeleteModelMutation(
    schemaResource: string,
    options?: Options
) {
    const engine = useDataEngine()

    return useMutation({
        ...options,
        mutationFn: (variables: MutationFnArgs) => {
            return engine.mutate({
                resource: schemaResource,
                id: variables.id,
                type: 'delete',
            })
        },
    })
}
