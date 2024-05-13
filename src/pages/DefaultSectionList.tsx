import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import React from 'react'
import { useQuery } from 'react-query'
import { SectionListWrapper } from '../components'
import { useModelListView } from '../components/sectionList/listView'
import {
    useSchemaFromHandle,
    useParamsForDataQuery,
    BaseListModel,
    DEFAULT_FIELD_FILTERS,
} from '../lib'
import { getFieldFilter } from '../lib/models/path'
import { WrapQueryResponse } from '../types'
import { PagedResponse } from '../types/models'

type ModelListResponse = WrapQueryResponse<PagedResponse<BaseListModel, string>>

export const DefaultSectionList = () => {
    const { columns } = useModelListView()
    const schema = useSchemaFromHandle()
    const engine = useDataEngine()
    const modelListName = schema.plural

    const initialParams = useParamsForDataQuery()

    const query = {
        result: {
            resource: modelListName,
            params: {
                ...initialParams,
                fields: columns
                    .map((column) => getFieldFilter(schema, column.path))
                    .concat(DEFAULT_FIELD_FILTERS),
            },
        },
    }
    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<ModelListResponse>
        },
    })
    const modelList = data?.result[modelListName]

    return (
        <div>
            <SectionListWrapper
                error={error as FetchError | undefined}
                data={modelList}
                pager={data?.result.pager}
            />
        </div>
    )
}
