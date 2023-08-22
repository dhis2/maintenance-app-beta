import { useCallback, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { Section, getColumnsForSection } from '../../../constants'
import { useModelSectionHandleOrThrow, useSchemaFromHandle } from '../../../lib'
import { useDataStoreValues } from '../../../lib/dataStore'
import {
    queryCreators,
    useMutateDataStoreValues,
} from '../../../lib/dataStore/useDataStore'
import { ModelSection } from '../../../types'

export type Columns = string[]
type ColumnsResult = Record<
    string,
    {
        columns: Columns
    }
>

const maintenanceNamespace = 'maintenance'
const configurableColumnsKey = 'modelListViews'

// check that columns are valid - because data in dataStore should not
// be trusted - since there's no validation server-side.
// we use same dataStore-keys as old app to be backwards-compatible
// this stores columns as filters - eg. categoryCombo[displayName]
// remove this part, sicne we're not interested in them
// also map displayName to name, since in GIST-API 'names' are translated
const createValidColumnsSelect = (sectionName: string) => {
    const validColumns = new Set(getColumnsForSection(sectionName).available)

    return (data: ColumnsResult): Columns => {
        const columnsForSection = data?.[sectionName]?.columns
        if (!columnsForSection) {
            return []
        }
        return columnsForSection
            .map((c) =>
                c.replace('displayName', 'name').replace(/(.*)\[.+\]/, '$1')
            )
            .filter((c) => validColumns.has(c))
    }
}

const getColumnListBySection = (section: ModelSection) => section.name

export const useSelectedColumns = () => {
    const section = useModelSectionHandleOrThrow()
    const columnListName = getColumnListBySection(section)
    const select = useMemo(
        () => createValidColumnsSelect(columnListName),
        [columnListName]
    )
    const query = useDataStoreValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
        placeholderData: {
            [columnListName]: {
                columns: getColumnsForSection(columnListName).default,
            },
        },
        // selects the specific section from the result
        select,
    })

    let selectedColumnsForSection = query.data || []
    if (query.error) {
        if (query.error?.details.httpStatusCode !== 404) {
            console.error(query.error)
        }
        selectedColumnsForSection = getColumnsForSection(columnListName).default
    }

    return {
        columns: selectedColumnsForSection,
        query: query,
    }
}

export const useMutateSelectedColumns = () => {
    const section = useModelSectionHandleOrThrow()
    const queryClient = useQueryClient()
    const columnListName = getColumnListBySection(section)

    const mutation = useMutateDataStoreValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
    })
    const mutate = mutation.mutate
    const saveColumns = useCallback(
        async (
            newColumns: Columns,
            mutateOptions?: Parameters<typeof mutate>[1]
        ) => {
            const valuesQueryKey = [
                queryCreators.getValues({
                    namespace: maintenanceNamespace,
                    key: configurableColumnsKey,
                }),
            ]
            let prevData = {}

            try {
                // note, because selectors are per-observer, these are not "mapped" to valid a specific section
                // it's exact data as we got from the request
                prevData = await queryClient.fetchQuery(valuesQueryKey)
            } catch (e) {
                // default to empty object
            }

            const newColumnsData: ColumnsResult = {
                ...prevData,
                [columnListName]: {
                    columns: newColumns,
                },
            }
            return mutate(newColumnsData, mutateOptions)
        },
        [queryClient, mutate, columnListName]
    )

    return { mutation, saveColumns }
}
