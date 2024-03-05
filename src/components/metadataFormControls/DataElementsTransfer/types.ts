import { DataElement, GistCollectionResponse } from '../../../types/generated'

const filterFields = ['id', 'displayName'] as const //(name is translated by default in /gist)
export type FilteredDataElement = Pick<
    DataElement,
    (typeof filterFields)[number]
>
export type DataElementsQueryResult =
    GistCollectionResponse<FilteredDataElement>
