import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionListWrapper,
    SelectedColumns,
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

const defaulHeaderColumns: SelectedColumns<FilteredDataElement> = [
    {
        modelPropertyName: 'name',
        label: i18n.t('Name'),
    },
    { modelPropertyName: 'domainType', label: i18n.t('Domain') },
    { modelPropertyName: 'valueType', label: i18n.t('Value') },
    { modelPropertyName: 'lastUpdated', label: i18n.t('Last updated') },
    { modelPropertyName: 'sharing', label: i18n.t('Public access') },
]

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
                defaultColumns={defaulHeaderColumns}
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
