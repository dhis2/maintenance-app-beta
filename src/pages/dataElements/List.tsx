import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect } from 'react'
import {
    SectionListWrapper,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    useQueryParamsForModelGist,
} from '../../components'
import { DataElementInDataSetFilter } from '../../components/sectionList/filters/DataElementInDataSetFilter'
import { useModelListView } from '../../components/sectionList/listView'
import { useSchemaFromHandle } from '../../lib/'
import { getFieldFilter } from '../../lib/models/path'
import { Query, WrapQueryResponse } from '../../types'
import { DataElement, ModelCollectionResponse } from '../../types/models'

const filterFields = [
    'access',
    'id',
    'name',
    'code',
    'domainType',
    'valueType',
    'lastUpdated',
    'sharing',
] as const

type FilteredDataElement = Pick<DataElement, (typeof filterFields)[number]>

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
    const initialParams = useQueryParamsForModelGist()
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

        const filters = initialParams.filter.map((filter) => {
            const [field, operator, value] = filter.split(':')
            if (field === 'dataSetElements') {
                return `dataSetElements.dataSet.id:eq:${value}`
            }
            return filter
        })

        const fields = columns
            .map((column) => getFieldFilter(schema, column.path))
            .concat('id')

        refetch({
            ...initialParams,
            fields: fields,
            filter: filters,
        })
    }, [refetch, initialParams, columns, listViewQuery.isLoading, schema])

    return (
        <div>
            <SectionListWrapper
                filterElement={
                    <>
                        <DomainTypeSelectionFilter />
                        <ValueTypeSelectionFilter />
                        <DataElementInDataSetFilter />
                    </>
                }
                error={error}
                data={data?.result.dataElements}
                pager={data?.result.pager}
            />
        </div>
    )
}
