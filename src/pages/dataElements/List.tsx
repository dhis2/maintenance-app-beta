import React from 'react'
import {
    SectionListWrapper,
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
    useQueryParamsForModelGist,
    useSectionListParamsRefetch,
} from '../../components'
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

    useSectionListParamsRefetch(refetch)

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
