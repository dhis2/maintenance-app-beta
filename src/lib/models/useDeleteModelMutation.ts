import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMutation } from 'react-query'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    id: string
}

export function useDeleteModelMutation(schema: Schema) {
    const { show: showDeletionSuccess } = useAlert(
        i18n.t('Successfully deleted the {{model}}', {
            model: schema.singular,
        }),
        { success: true }
    )
    const { show: showDeletionFailure } = useAlert(
        i18n.t('Failed deleting the {{model}}!', {
            model: schema.singular,
        }),
        { success: false }
    )
    const engine = useDataEngine()
    const mutationFn = async (variables: MutationFnArgs) => {
        try {
            const result = await engine.mutate({
                resource: schema.plural,
                id: variables.id,
                type: 'delete',
            })

            showDeletionSuccess()
            return result
        } catch (e) {
            showDeletionFailure()
        }
    }

    return useMutation({ mutationFn })
}
