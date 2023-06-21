import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import {
    SectionList,
    SectionListRow,
    SectionListWrapper,
    SelectedColumns,
} from '../../components'
import { useModelGist } from '../../lib/'
import {
    DataElement,
    GistCollectionResponse,
    GistModel,
    IdentifiableObject,
} from '../../types/models'

const filterFields = [
    'access',
    'id',
    'name',
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
            pageListName: 'result',
            order: 'name:ASC',
        }
    )

    const [filter, setFilter] = React.useState('')

    useEffect(() => {
        if (filter) {
            console.log('refetch', filter)
            refetch({
                filter: [`name:ilike:${filter}`, 'domainType:eq:AGGREGATE'],
            })
        } else {
            refetch({ filter: undefined })
        }
    }, [refetch, filter])

    return (
        <div>
            <input
                type="text"
                onChange={(val) => setFilter(val.target.value)}
            ></input>
            <SectionListWrapper
                defaultColumns={defaulHeaderColumns}
                data={data}
            />
            <button onClick={() => pagination.getNextPage()}>Next Page</button>
        </div>
    )
}
