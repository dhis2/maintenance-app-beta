import {
    DelimitedArrayParam,
    encodeDelimitedArray,
    decodeDelimitedArray,
} from 'use-query-params'

// default is "_" which breaks constants (delimited by _)
const ARRAY_ENTRY_SEPERATOR = ','

export const CustomDelimitedArrayParam: typeof DelimitedArrayParam = {
    encode: (arr) => encodeDelimitedArray(arr, ARRAY_ENTRY_SEPERATOR),

    decode: (str) => decodeDelimitedArray(str, ARRAY_ENTRY_SEPERATOR),
}
