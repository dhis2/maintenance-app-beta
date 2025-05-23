import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import { DataEngine } from '../../../types'
import { OrgUnitFormValues } from '../Edit'

type DataSetsAndPrograms = {
    dataSets?: {
        id: string
    }[]
    programs?: { id: string }[]
}
export const useOnSaveDataSetsAndPrograms = () => {
    const dataEngine: DataEngine = useDataEngine()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    return useMemo(
        () => async (orgId: string, values: DataSetsAndPrograms) => {
            const fieldToSaveSeparately = ['dataSets', 'programs']

            const fieldToEditSeparatelyResults = await Promise.allSettled(
                fieldToSaveSeparately.map((field) =>
                    dataEngine.mutate({
                        resource: `organisationUnits`,
                        type: 'update',
                        data: {
                            identifiableObjects:
                                values[field as keyof DataSetsAndPrograms],
                        },
                        id: `${orgId}/${field}`,
                    })
                )
            )

            const fieldToSaveSeparatelyErrors = fieldToSaveSeparately
                .map((field, index) =>
                    fieldToEditSeparatelyResults[index].status === 'rejected'
                        ? field
                        : undefined
                )
                .filter((field) => !!field)

            if (fieldToSaveSeparatelyErrors.length > 0) {
                saveAlert.show({
                    message: i18n.t(
                        `The organisation unit was saved successfully but there was a problem saving ${fieldToSaveSeparatelyErrors.join(
                            ' and '
                        )}`
                    ),
                    warning: true,
                })
            } else {
                saveAlert.show({
                    message: i18n.t('Saved successfully'),
                    success: true,
                })
            }
            return fieldToSaveSeparatelyErrors
        },
        [dataEngine, saveAlert]
    )
}
