import React, { useEffect } from 'react'
import {
    SectionListWrapper,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    useQueryParamsForModelGist,
} from '../../components'
import { useModelListView } from '../../components/sectionList/listView'
import { getFieldFilterFromPath, useModelGist } from '../../lib/'
import { DataElement, GistCollectionResponse } from '../../types/models'

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

type DataElements = GistCollectionResponse<FilteredDataElement>

export const Component = () => {
    const { columns, query: listViewQuery } = useModelListView()
    const initialParams = useQueryParamsForModelGist()
    const { refetch, error, data } = useModelGist<DataElements>(
        'dataElements/gist',
        {
            fields: filterFields.concat(),
            ...initialParams,
        },
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
                .map((column) => getFieldFilterFromPath(column.path, 0))
                .concat('id'),
        })
    }, [refetch, initialParams, columns, listViewQuery.isLoading])

    return (
        <div>
            <SectionListWrapper
                filterElement={
                    <>
                        <DomainTypeSelectionFilter />
                        <ValueTypeSelectionFilter />
                    </>
                }
                error={error}
                data={data}
            />
        </div>
    )
}
