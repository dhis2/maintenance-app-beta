// special key for handling search for identifiable objects
// eg. searches for name, code, id and shortname
// this would translate to "token" in the old API, but does not exist in GIST-API
export const IDENTIFIABLE_KEY = 'identifiable'

/* Allowed "keys" to filter by
	Used to specify the allowed filters in the query-Params as well
	as mapping to the correct filter component */
export const validFilterKeys = [
    IDENTIFIABLE_KEY,
    'domainType',
    'valueType',
    'dataSet',
    'categoryCombo',
] as const

const filterKeysSet = new Set(validFilterKeys)

export type FilterKeys = typeof validFilterKeys
//export const filterKeys = Object.keys(filterKeys)

export type FilterKey = FilterKeys[number]

// Identifiable is not configurable, and is always shown in the list
export type ConfigurableFilterKey = Exclude<FilterKey, typeof IDENTIFIABLE_KEY>
