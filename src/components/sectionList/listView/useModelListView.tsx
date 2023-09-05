import { useMemo, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { z } from 'zod'
import { SECTIONS_MAP, getViewConfigForSection } from '../../../constants'
import { useModelSectionHandleOrThrow } from '../../../lib'
import { useDataStoreValues } from '../../../lib/dataStore'
import {
    queryCreators,
    useMutateDataStoreValues,
} from '../../../lib/dataStore/useDataStore'
import { ModelListView } from './types'

const maintenanceNamespace = 'maintenance'
const configurableColumnsKey = 'modelListViews'

const valuesQueryKey = [
    queryCreators.getValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
    }),
]

const modelListViewSchema = z.object({
    name: z.string(),
    sectionModel: z.string(),
    columns: z.array(z.string()),
    filters: z.array(z.string()),
})

type DataModelListView = z.infer<typeof modelListViewSchema>

const modelListViewsSchema = z.record(z.array(modelListViewSchema).length(1)) // TODO: support only one view for now - but update this to support multiple views
type DataModelListViews = z.infer<typeof modelListViewsSchema>

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
    data: DataModelListView,
    name: string
): ModelListView => {
    const listView = modelListViewSchema.safeParse(data)
    if (!listView.success) {
        return getDefaultViewForSection(name)
    }
    const viewConfig = getViewConfigForSection(name)

    const parsedView = listView.data
    // map to config to make sure we don't use invalid column
    const columns = viewConfig.columns.available
        .filter((col) => parsedView.columns.includes(col.path))
        .map((c) => ({
            ...c,
            path: c.path.replace('displayName', 'name'),
            // .replace(/(.*)\[.+\]/, '$1'),
        }))

    const filters = viewConfig.filters.available.filter((col) =>
        parsedView.filters.includes(col.path)
    )

    return {
        ...parsedView,
        columns: columns.length < 1 ? viewConfig.columns.default : columns,
        filters: filters.length < 1 ? viewConfig.columns.default : filters,
    }
}

const formatViewToDataStore = (
    view: ModelListView
): z.infer<typeof modelListViewSchema> => {
    const savedView = {
        ...view,
        columns: view.columns.map((c) => c.path),
        filters: view.filters.map((f) => f.path),
    }

    return savedView
}

// check that columns are valid - because data in dataStore should not
// be trusted - since there's no validation server-side.
// we use same dataStore-keys as old app to be backwards-compatible
// this stores columns as filters - eg. categoryCombo[displayName]
// remove this part, sicne we're not interested in them
// also map displayName to name, since in GIST-API 'names' are translated
const createValidViewSelect = (sectionName: string) => {
    return (data: DataModelListViews): ModelListView => {
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

    const query = useDataStoreValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
        // selects the specific section from the result
        select,
    })

    if (query.error) {
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

    const mutation = useMutateDataStoreValues({
        namespace: maintenanceNamespace,
        key: configurableColumnsKey,
    })
    const mutate = mutation.mutate

    const getListViews = useCallback(() => {
        // note, because selectors are per-observer, these are not "mapped" to valid a specific section
        // it's exact data as we got from the request
        const prevData: WrapInResult<DataModelListViews> | undefined =
            queryClient.getQueryData(valuesQueryKey)
        if (!prevData) {
            return {}
        }

        return prevData.result
    }, [queryClient])

    const saveView = useCallback(
        async (
            newView: Partial<DataModelListView> & { name: string },
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

            const newViewsData: DataModelListViews = {
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
