import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect } from 'react'
import { SectionListWrapper } from '../../components'
import { useModelListView } from '../../components/sectionList/listView'
import {
    useSchemaFromHandle,
    useParamsForDataQuery,
    DEFAULT_FIELD_FILTERS,
    DefaultFields,
} from '../../lib/'
import { getFieldFilter } from '../../lib/models/path'
import { Query, WrapQueryResponse } from '../../types'
import { DataElement, ModelCollectionResponse } from '../../types/models'

type FilteredDataElement = Pick<DataElement, DefaultFields> &
    Partial<DataElement>

type DataElements = ModelCollectionResponse<FilteredDataElement, 'dataElements'>

type DataElementsResponse = WrapQueryResponse<DataElements>

const query: Query = {
    result: {
        resource: 'dataElements',
        params: (params) => params,
    },
}

export const Component = () => {
    const { columns, query: listViewQuery } = useModelListView()
    const initialParams = useParamsForDataQuery()
    const schema = useSchemaFromHandle()
    const { refetch, error, data } = useDataQuery<DataElementsResponse>(
        query,
        // refetched on mount by effect below
        { lazy: true }
    )

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
                data={data?.result.dataElements}
                pager={data?.result.pager}
            />
        </div>
    )
}
