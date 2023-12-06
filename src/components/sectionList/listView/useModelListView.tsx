import { useMemo, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { z } from 'zod'
import {
    getViewConfigForSection,
    sectionNames,
    useModelSectionHandleOrThrow,
    useDataStoreValuesQuery,
    queryCreators,
    useMutateDataStoreValuesQuery,
} from '../../../lib'
import type { ModelListView } from './types'

const maintenanceNamespace = 'maintenance'
const configurableColumnsKey = 'modelListViews'

const valuesQueryKey = [
    queryCreators.getValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
    }),
]

const dataStoreModelListViewSchema = z.object({
    name: z.string(),
    sectionModel: z.string(),
    columns: z.array(z.string()),
    filters: z.array(z.string()),
})

type DataStoreModelListView = z.infer<typeof dataStoreModelListViewSchema>

const modelListViewsSchema = z
    // TODO: support only one view for now - but update this to support multiple views
    .record(
        z
            .string()
            .refine((val) => sectionNames.has(val), 'Not a valid section'),
        z.array(dataStoreModelListViewSchema).length(1)
    )
    .refine((val) => Object.keys(val).length > 0)

type DataStoreModelListViews = z.infer<typeof modelListViewsSchema>

const getDefaultViewForSection = (sectionName: string): ModelListView => {
    const defaultViewConfig = getViewConfigForSection(sectionName)
    return {
        name: 'default',
        sectionModel: sectionName,
        columns: defaultViewConfig.columns.default,
        filters: defaultViewConfig.filters.default,
    }
}

// parses and validates stored data in UserDataStore to internal format
// labels are not stored since these are translated
const parseViewToModelListView = (
    data: DataStoreModelListView,
    name: string
): ModelListView => {
    const listView = dataStoreModelListViewSchema.safeParse(data)
    if (!listView.success) {
        return getDefaultViewForSection(name)
    }
    const viewConfig = getViewConfigForSection(name)

    const parsedView = listView.data

    const availableColumnsMap = new Map(
        viewConfig.columns.available.map((c) => [c.path, c] as const)
    )
    // map to config to make sure we don't use invalid columns
    // Preserve order by mapping from parsedView to config-object
    const columns = parsedView.columns
        .filter((col) => availableColumnsMap.has(col))
        .map((col) => {
            const columnConfig = availableColumnsMap.get(col)
            return columnConfig as NonNullable<typeof columnConfig>
        })

    const filters = viewConfig.filters.available.filter((col) =>
        parsedView.filters.includes(col.path)
    )

    return {
        ...parsedView,
        columns,
        filters,
    }
}

const formatViewToDataStore = (
    view: ModelListView
): z.infer<typeof dataStoreModelListViewSchema> => {
    const savedView = {
        ...view,
        columns: view.columns.map((c) => c.path),
        filters: view.filters.map((f) => f.path),
    }

    return savedView
}

// selects the specific section from the result, based on sectionName
// check that columns are valid - because data in dataStore should not
// be trusted - since there's no validation server-side.
const createValidViewSelect = (sectionName: string) => {
    return (data: DataStoreModelListViews): ModelListView => {
        const modelListViews = modelListViewsSchema.safeParse(data)

        if (!modelListViews.success) {
            console.warn('Failed to parse modelListViews', modelListViews.error)
            return getDefaultViewForSection(sectionName)
        }

        const viewForSection = modelListViews.data[sectionName][0]
        if (!viewForSection) {
            return getDefaultViewForSection(sectionName)
        }
        return parseViewToModelListView(viewForSection, sectionName)
    }
}

export const useModelListView = () => {
    const section = useModelSectionHandleOrThrow()
    const select = useMemo(() => createValidViewSelect(section.name), [section])

    const query = useDataStoreValuesQuery({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
        // selects the specific section from the result
        select,
    })

    // 404 errors are expected when user havent saved any views
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (query.error && (query.error as any).details?.httpStatusCode !== 404) {
        console.error(query.error)
    }

    const selectedView = query.data || getDefaultViewForSection(section.name)

    const columns = selectedView.columns
    const filters = selectedView.filters

    return { view: selectedView, columns, filters, query }
}

type WrapInResult<TResult> = {
    result: TResult
}
export const useMutateModelListViews = () => {
    const section = useModelSectionHandleOrThrow()
    const queryClient = useQueryClient()

    const mutation = useMutateDataStoreValuesQuery({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
    })
    const mutate = mutation.mutate

    const getListViews = useCallback(() => {
        // note, because selectors are per-observer, these are not "mapped" to valid a specific section
        // it's exact data as we got from the request
        const prevData: WrapInResult<DataStoreModelListViews> | undefined =
            queryClient.getQueryData(valuesQueryKey)

        // need to validate here since we're not using a selector
        const validView = modelListViewsSchema.safeParse(prevData?.result)
        if (!validView.success) {
            return {}
        }

        return validView.data
    }, [queryClient])

    const saveView = useCallback(
        async (
            newView: Partial<DataStoreModelListView> & { name: string },
            mutateOptions?: Parameters<typeof mutate>[1]
        ) => {
            const prevData = getListViews()
            let viewsForSection = prevData[section.name]
            if (!viewsForSection) {
                viewsForSection = [
                    formatViewToDataStore(
                        getDefaultViewForSection(section.name)
                    ),
                ]
            }
            const newViewsForSection = viewsForSection.map((view) => {
                if (view.name === newView.name) {
                    return {
                        ...view,
                        ...newView,
                    }
                }
                return view
            })

            const newViewsData: DataStoreModelListViews = {
                ...prevData,
                [section.name]: newViewsForSection,
            }
            return mutate(newViewsData, mutateOptions)
        },
        [mutate, section, getListViews]
    )

    const saveColumns = useCallback(
        async (
            columns: string[],
            mutateOptions?: Parameters<typeof mutate>[1]
        ) => {
            const newView = {
                name: 'default',
                columns,
            }
            return saveView(newView, mutateOptions)
        },
        [saveView]
    )

    return { mutation, saveColumns }
}
