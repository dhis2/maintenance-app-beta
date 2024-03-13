import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from 'react-query'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    schema: Schema
    id: string
}

export function useDeleteModelMutation() {
    const engine = useDataEngine()
    const mutationFn = async (variables: MutationFnArgs) =>
        engine.mutate({
            resource: variables.schema.plural,
            id: variables.id,
            type: 'delete',
        })

    return useMutation({ mutationFn })
}
