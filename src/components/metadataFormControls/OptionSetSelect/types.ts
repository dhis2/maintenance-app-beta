import { OptionSet, GistCollectionResponse } from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredOptionSet = Pick<OptionSet, (typeof filterFields)[number]>
export type OptionSetQueryResult = GistCollectionResponse<FilteredOptionSet>
