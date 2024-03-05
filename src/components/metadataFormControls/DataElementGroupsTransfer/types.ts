import {
    DataElementGroup,
    GistCollectionResponse,
} from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredDataElementGroup = Pick<
    DataElementGroup,
    (typeof filterFields)[number]
>
export type DataElementGroupsQueryResult =
    GistCollectionResponse<FilteredDataElementGroup>
