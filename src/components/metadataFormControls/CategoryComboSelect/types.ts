import { CategoryCombo, GistCollectionResponse } from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredCategoryCombo = Pick<
    CategoryCombo,
    (typeof filterFields)[number]
>
export type CategoryComboQueryResult =
    GistCollectionResponse<FilteredCategoryCombo>
