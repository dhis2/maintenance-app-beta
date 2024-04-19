import { DataElement, PickModelFields } from '../../../types/generated'
import { fieldFilters } from '../Edit copy'
export type FormValues = DataElement

export type DataElementFormValues = PickModelFields<
    DataElement,
    (typeof fieldFilters)[number]
>
