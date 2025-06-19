import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    getSectionPath,
    SECTIONS_MAP,
    useNavigateWithSearchState,
} from '../../../lib'
import { createFormError } from '../../../lib/form/createFormError'
import { DataSetNotificationTemplate } from './getInitialValuesFromTemplate'

const section = SECTIONS_MAP.dataSetNotificationTemplate

export const useOnEditNotifications = (templateId: string) => {
    const engine = useDataEngine()
    const navigate = useNavigateWithSearchState()
    const queryClient = useQueryClient()
    const { show } = useAlert((msg) => msg, { success: true })

    return useMemo(
        () => async (values: DataSetNotificationTemplate) => {
            try {
                const response = await engine.mutate({
                    resource: 'dataSetNotificationTemplates',
                    id: templateId,
                    type: 'update',
                    data: values,
                    params: {
                        mergeMode: 'REPLACE',
                    },
                })

                await queryClient.invalidateQueries({
                    queryKey: [{ resource: 'dataSetNotificationTemplates' }],
                })

                show({
                    message: 'Notification template Edited successfully',
                    success: true,
                })

                navigate(`/${getSectionPath(section)}`)
                return response
            } catch (error) {
                return createFormError(error)
            }
        },
        [engine, navigate, queryClient, templateId]
    )
}
