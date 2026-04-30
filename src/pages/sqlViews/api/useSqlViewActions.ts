import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useCallback, useState } from 'react'
import { SqlView } from '../../../types/generated'

export type SqlViewType = SqlView.type
export type SqlViewActionResult = {
    success: boolean
    errorMessage?: string
}

export const getServerErrorMessage = (error: unknown): string => {
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
    ) {
        return (error as { message: string }).message
    }
    return i18n.t('An unknown error occurred.')
}

const isQueryType = (type: SqlViewType | undefined) =>
    type === SqlView.type.QUERY

export const useRunSqlView = () => {
    const dataEngine = useDataEngine()
    const successAlert = useAlert(({ message }) => message, {
        success: true,
        duration: 3000,
    })
    const errorAlert = useAlert(({ message }) => message, { critical: true })
    const [running, setRunning] = useState(false)

    const run = useCallback(
        async (id: string, type: SqlViewType): Promise<SqlViewActionResult> => {
            if (isQueryType(type)) {
                return { success: true }
            }
            setRunning(true)
            try {
                if (type === SqlView.type.MATERIALIZED_VIEW) {
                    await dataEngine.mutate({
                        resource: `sqlViews/${id}/refresh`,
                        type: 'create',
                        data: {},
                    })
                    successAlert.show({
                        message: i18n.t('Materialized view refreshed.'),
                    })
                } else {
                    await dataEngine.mutate({
                        resource: `sqlViews/${id}/execute`,
                        type: 'create',
                        data: {},
                    })
                    successAlert.show({
                        message: i18n.t('SQL view created or updated.'),
                    })
                }
                return { success: true }
            } catch (e) {
                const errorMessage = getServerErrorMessage(e)
                errorAlert.show({
                    message: i18n.t('Could not run SQL view: {{error}}', {
                        error: errorMessage,
                    }),
                })
                return { success: false, errorMessage }
            } finally {
                setRunning(false)
            }
        },
        [dataEngine, successAlert, errorAlert]
    )

    return { run, running }
}
