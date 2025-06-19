import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
    useNavigateWithSearchState,
    getSectionPath,
    SECTIONS_MAP,
} from '../../../lib'
import { createFormError } from '../../../lib/form/createFormError'
import {
    DataSetNotificationFormValues,
    transformFormValues,
} from './getInitialValuesFromTemplate'

const section = SECTIONS_MAP.dataSetNotificationTemplate

export const useOnSaveNotifications = () => {
    const dataEngine = useDataEngine()
    const navigate = useNavigateWithSearchState()
    const { show } = useAlert((msg) => msg, { success: true })

    return useMemo(
        () => async (values: DataSetNotificationFormValues) => {
            try {
                const payload = transformFormValues(values)

                const response = await dataEngine.mutate({
                    resource: 'dataSetNotificationTemplates',
                    type: 'create',
                    data: payload,
                })

                show('Notification template created successfully')
                navigate(`/${getSectionPath(section)}`)
                return { data: response }
            } catch (error) {
                return createFormError(error)
            }
        },
        [dataEngine, navigate, show]
    )
}
