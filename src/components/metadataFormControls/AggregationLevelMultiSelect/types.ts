import {
    OrganisationUnitLevel,
    GistCollectionResponse,
} from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredAggregationLevel = Pick<
    OrganisationUnitLevel,
    (typeof filterFields)[number]
>
export type AggregationLevelQueryResult =
    GistCollectionResponse<FilteredAggregationLevel>
