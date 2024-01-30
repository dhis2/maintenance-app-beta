import { ResultQuery } from '../../../../types'

export const createFilterDataQuery = (resource: string): ResultQuery => ({
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
