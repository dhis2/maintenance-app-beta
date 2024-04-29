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
import {
    DataElement,
    ModelCollectionResponse,
    OrganisationUnit,
} from '../../types/models'
import { OrganisationUnitList } from './list/OrganisationUnitList'

type FilteredOrganisationUnits = Pick<OrganisationUnit, DefaultFields> &
    Partial<OrganisationUnit>

type OrganisationUnits = ModelCollectionResponse<
    FilteredOrganisationUnits,
    'organisationUnits'
>

type OrganisationUnitsResponse = WrapQueryResponse<OrganisationUnits>

const query: Query = {
    result: {
        resource: 'organisationUnits',
        params: (params) => params,
    },
}

// export const Component = () => {
//     const { columns, query: listViewQuery } = useModelListView()
//     const initialParams = useParamsForDataQuery()
//     const schema = useSchemaFromHandle()
//     const { refetch, error, data } = useDataQuery<OrganisationUnitsResponse>(
//         query,
//         // refetched on mount by effect below
//         { lazy: true }
//     )

//     useEffect(() => {
//         // wait to fetch until selected-columns are loaded
//         // so we dont fetch data multiple times
//         if (listViewQuery.isLoading) {
//             return
//         }
//         refetch({
//             ...initialParams,
//             fields: columns
//                 .map((column) => getFieldFilter(schema, column.path))
//                 .concat(DEFAULT_FIELD_FILTERS),
//         })
//     }, [refetch, initialParams, columns, listViewQuery.isLoading, schema])

//     return (
//         <div>
//             <SectionListWrapper
//                 error={error}
//                 data={data?.result.dataElements}
//                 pager={data?.result.pager}
//                 refetch={refetch}
//             />
//         </div>
//     )
// }

export const Component = () => {
    return <OrganisationUnitList />
}
