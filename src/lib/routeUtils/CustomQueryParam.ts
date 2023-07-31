import { encodeObject, decodeObject, ObjectParam } from 'use-query-params'

const entrySeparator = '~' // default is "_" which breaks constants (delimited by _)

export const CustomObjectParam: typeof ObjectParam = {
    encode: (obj) => encodeObject(obj, undefined, entrySeparator),

    decode: (str) => decodeObject(str, undefined, entrySeparator),
}
