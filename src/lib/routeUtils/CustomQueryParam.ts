import pick from 'lodash/pick'
import {
    encodeObject,
    decodeObject,
    ObjectParam,
    QueryParamConfig,
} from 'use-query-params'
import {
    FilterKey,
    validFilterKeys,
} from '../constants/sectionListView/sectionListViewFilterKeys'
const entrySeparator = '~' // default is "_" which breaks constants (delimited by _)

export const CustomObjectParam: typeof ObjectParam = {
    encode: (obj) => encodeObject(obj, undefined, entrySeparator),

    decode: (str) => decodeObject(str, undefined, entrySeparator),
}

type FilterObject = { [key in FilterKey]?: string } | undefined | null
export type SectionListFilterObjectParamType = QueryParamConfig<FilterObject>

export const SectionListFilterObjectParam: SectionListFilterObjectParamType = {
    encode: (obj) => {
        const filteredObj = pick(obj, validFilterKeys)

        return encodeObject(filteredObj, undefined, entrySeparator)
    },

    decode: (str) => {
        const decoded = decodeObject(str, undefined, entrySeparator)
        return pick(decoded, validFilterKeys)
    },
}
