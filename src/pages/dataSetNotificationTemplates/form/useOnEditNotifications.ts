import { useAlert, useDataEngine } from '@dhis2/app-runtime'
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

                show('Notification template Edited successfully')

                navigate(`/${getSectionPath(section)}`)
                return response
            } catch (error) {
                return createFormError(error)
            }
        },
        [engine, navigate, templateId]
    )
}
