import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMutation } from 'react-query'
import { Schema } from '../useLoadApp'

type MutationFnArgs = {
    id: string
    displayName: string
    messages?: string[]
}

export function useDeleteModelMutation(schema: Schema) {
    const engine = useDataEngine()
    const { show: showDeletionSuccess } = useAlert(
        ({ displayName, modelType }) =>
            i18n.t('Successfully deleted {{modelType}} "{{displayName}}"', {
                displayName,
                modelType,
            }),
        { success: true }
    )

    const { show: showDeletionFailure } = useAlert(
        ({ displayName, modelType, messages }) => {
            if (messages) {
                return i18n.t(
                    'Failed to delete {{modelType}} "{{displayName}}"! {{messages}}',
                    { displayName, modelType, messages: messages.join('; ') }
                )
            }

            return i18n.t('Failed to delete {{modelType}} "{{displayName}}"!', {
                displayName,
                modelType,
            })
        },
        { success: false }
    )

    return useMutation({
        mutationFn: (variables: MutationFnArgs) => {
            const alertPayload = {
                modelType: schema.singular,
                displayName: variables.displayName,
            }

            return engine
                .mutate({
                    resource: schema.plural,
                    id: variables.id,
                    type: 'delete',
                })
                .then((result) => {
                    showDeletionSuccess(alertPayload)
                    return result
                })
                .catch((e) => {
                    if (e?.details?.response?.errorReports) {
                        showDeletionFailure({
                            ...alertPayload,
                            messages: e.details.response.errorReports.map(
                                ({ message }: { message: string }) => message
                            ),
                        })
                    } else {
                        showDeletionFailure(alertPayload)
                    }

                    throw e
                })
        },
    })
}
