import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from 'react-query'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    id: string
    displayName: string
    messages?: string[]
}

export function useDeleteModelMutation(schema: Schema) {
    const engine = useDataEngine()

    return useMutation({
        mutationFn: (variables: MutationFnArgs) => {
            return engine.mutate({
                resource: schema.plural,
                id: variables.id,
                type: 'delete',
            })
        },
    })
}
