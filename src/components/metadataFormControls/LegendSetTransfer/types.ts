import { LegendSet, GistCollectionResponse } from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredLegendSet = Pick<LegendSet, (typeof filterFields)[number]>
export type LegendSetQueryResult = GistCollectionResponse<FilteredLegendSet>
