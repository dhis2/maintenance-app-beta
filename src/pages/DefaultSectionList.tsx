import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { SectionListWrapper } from '../components'
import { DefaultListActionProps } from '../components/sectionList/listActions/DefaultListActions'
import { useModelListView } from '../components/sectionList/listView'
import {
    useSchemaFromHandle,
    useParamsForDataQuery,
    BaseListModel,
    DEFAULT_FIELD_FILTERS,
    isNonSchemaSection,
    DEFAULT_ACCESS,
} from '../lib'
import { getFieldFilter } from '../lib/models/path'
import { WrapQueryResponse } from '../types'
import { PagedResponse } from '../types/models'

type ModelListResponse = WrapQueryResponse<PagedResponse<BaseListModel, string>>

export type DefaultSectionListProps = {
    filters?: string[]
    ActionsComponent?: React.ComponentType<DefaultListActionProps>
}
export const DefaultSectionList = ({
    filters,
    ActionsComponent,
}: DefaultSectionListProps) => {
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
                filter: initialParams.filter.concat(filters ?? []),
                fields: columns
                    .map((column) => getFieldFilter(schema, column.path))
                    .concat(DEFAULT_FIELD_FILTERS),
            },
        },
    }

    const { error, data, refetch } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<ModelListResponse>
        },
    })

    const isNonSchema = isNonSchemaSection({ name: schema.name } as any)

    const raw = data?.result

    const modelList = isNonSchema
        ? Array.isArray(raw)
            ? raw.map((item: BaseListModel) => ({
                  ...item,
                  access: (schema as any).access ?? DEFAULT_ACCESS(),
                  sharing: { public: 'rw------' },
              }))
            : []
        : raw?.[schema.plural]

    return (
        <div>
            <SectionListWrapper
                error={error as FetchError | undefined}
                data={modelList}
                pager={data?.result.pager}
                refetch={refetch}
                ActionsComponent={ActionsComponent}
            />
        </div>
    )
}
