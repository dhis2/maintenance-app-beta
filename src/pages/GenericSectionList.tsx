import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect, useState } from 'react'
import { SectionListWrapper } from '../components'
import { useModelListView } from '../components/sectionList/listView'
import {
    useSchemaFromHandle,
    useParamsForDataQuery,
    BaseListModel,
    DEFAULT_FIELD_FILTERS,
} from '../lib'
import { getFieldFilter } from '../lib/models/path'
import { Query, WrapQueryResponse } from '../types'
import { PagedResponse } from '../types/models'

type ModelListResponsze = WrapQueryResponse<
    PagedResponse<BaseListModel, string>
>

const createQuery = (modelName: string): Query => ({
    result: {
        resource: modelName,
        params: (params) => params,
    },
})

export const GenericSectionList = () => {
    const { columns, query: listViewQuery } = useModelListView()
    const schema = useSchemaFromHandle()
    const modelListName = schema.plural
    const [query] = useState(() => createQuery(modelListName))
    const initialParams = useParamsForDataQuery()

    const { refetch, error, data } = useDataQuery<ModelListResponsze>(
        query,
        // refetched on mount by effect below
        { lazy: true }
    )
    const modelList = data?.result[modelListName]

    useEffect(() => {
        // wait to fetch until selected-columns are loaded
        // so we dont fetch data multiple times
        if (listViewQuery.isLoading) {
            return
        }
        refetch({
            ...initialParams,
            fields: columns
                .map((column) => getFieldFilter(schema, column.path))
                .concat(DEFAULT_FIELD_FILTERS),
        })
    }, [refetch, initialParams, columns, listViewQuery.isLoading, schema])

    return (
        <div>
            <SectionListWrapper
                error={error}
                data={modelList}
                pager={data?.result.pager}
            />
        </div>
    )
}
