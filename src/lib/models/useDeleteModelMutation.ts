import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from 'react-query'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    id: string
    displayName: string
    messages?: string[]
}

type Options = Omit<Parameters<typeof useMutation>[1], 'mutationFn'>

export function useDeleteModelMutation(schema: Schema, options?: Options) {
    const engine = useDataEngine()

    return useMutation({
        ...options,
        mutationFn: (variables: MutationFnArgs) => {
            return engine.mutate({
                resource: schema.plural,
                id: variables.id,
                type: 'delete',
            })
        },
    })
}
