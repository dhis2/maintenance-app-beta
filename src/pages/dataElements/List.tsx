import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionListWrapper,
    SelectedColumns,
    useSectionListFilterRefetch,
} from '../../components'
import {
    DomainTypeSelectionFilter,
    ValueTypeSelectionFilter,
} from '../../components/sectionList/filters/ConstantSelectionFilter'
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
    const { refetch, data, pagination } = useModelGist<DataElements>(
        'dataElements/gist',
        {
            fields: filterFields.concat(),
        }
    )
    useSectionListFilterRefetch(refetch)

    return (
        <div>
            <SectionListWrapper
                defaultColumns={defaulHeaderColumns}
                data={data}
                filterElement={
                    <>
                        <DomainTypeSelectionFilter />
                        <ValueTypeSelectionFilter />
                    </>
                }
            />
            <button onClick={() => pagination.getNextPage()}>Next Page</button>
        </div>
    )
}
