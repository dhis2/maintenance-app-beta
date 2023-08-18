import { useCallback } from 'react'
import { getColumnsForSection } from '../../../constants'
import { useSchemaFromHandle } from '../../../lib'
import { useDataStoreValues } from '../../../lib/dataStore'

type Columns = string[]
type ColumnsResult = Record<
    string,
    {
        columns: Columns
    }
>

const maintenanceNamespace = 'maintenance'
const configurableColumnsKey = 'configurableColumns'

// we use same dataStore-keys as old app to be backwards-compatible
// this stores columns as filters - eg. categoryCombo[displayName]
// remove this part, sicne we're not interested in them
// also map displayName to name, since in GIST-API 'names' are translated
const mapToValidColumns = (sectionName: string) => {
    const validColumns = getColumnsForSection(sectionName).available
    return (data: ColumnsResult): ColumnsResult => {
        const entries = Object.entries(data).map(([k, v]) => [
            k,
            {
                columns: v.columns
                    .map((c) =>
                        c
                            .replace('displayName', 'name')
                            .replace(/(.*)\[.+\]/, '$1')
                    )
                    .filter((c) => validColumns.includes(c)),
            },
        ])
        return Object.fromEntries(entries)
    }
}

export const useSelectedColumns = () => {
    const section = useSchemaFromHandle()
    // same as used in old maintenance app
    const columnListName = section.singular
    const select = mapToValidColumns(columnListName)
    const [queryResult, mutation] = useDataStoreValues<ColumnsResult>({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
        // placeholderData: {},
        select,
    })

    const saveColumns = useCallback(
        (
            newColumns: Columns,
            mutateOptions?: Parameters<typeof mutation.mutate>[1]
        ) => {
            const prevData = queryResult.data || {}
            const newColumnsData: ColumnsResult = {
                ...prevData,
                [columnListName]: {
                    columns: newColumns,
                },
            }
            return mutation.mutate(newColumnsData, mutateOptions)
        },
        [queryResult.data, columnListName, mutation]
    )

    // select columns for this section
    // cannot do this in "select" - because mutation need the
    // full ColumnsResult object to save all columns
    const selectedColumnsForSection =
        queryResult.data?.[columnListName]?.columns

    return {
        columns: selectedColumnsForSection,
        saveColumns,
        mutation,
        query: queryResult,
    }
}
