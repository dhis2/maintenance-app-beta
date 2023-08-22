import React, { useEffect } from 'react'
import {
    SectionListWrapper,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    useQueryParamsForModelGist,
    useSectionListParamsRefetch,
} from '../../components'
import { useSelectedColumns } from '../../components/sectionList/listView/useSelectedColumns'
import { useModelGist } from '../../lib/'
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
    const { columns, query } = useSelectedColumns()
    const initialParams = useQueryParamsForModelGist()
    const { refetch, error, data } = useModelGist<DataElements>(
        'dataElements/gist',
        {
            fields: filterFields.concat(),
            ...initialParams,
        },
        // refetched on mount by useSectionListParamsRefetch below
        { lazy: true }
    )

    useEffect(() => {
        console.log(query.isPlaceholderData)
        // wait to fetch until selected-columns are loaded
        // so we dont fetch data multiple times
        if (query.isPlaceholderData) {
            return
        }
        refetch({
            ...initialParams,
            fields: columns.concat('id'),
        })
    }, [refetch, initialParams, columns, query.isPlaceholderData])
    //useSectionListParamsRefetch(refetch)

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
