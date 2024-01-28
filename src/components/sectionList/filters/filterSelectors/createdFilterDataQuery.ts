import { Query } from '../../../../types'

export const createFilterDataQuery = (resource: string): Query => ({
    result: {
        resource: resource,
        params: (params) => ({
            ...params,
            fields: ['id', 'displayName'],
            order: 'displayName:asc',
            pageSize: 5,
        }),
    },
})
