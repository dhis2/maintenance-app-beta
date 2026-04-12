import { DEFAULT_FIELD_FILTERS } from '../../../lib'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'phase',
    'resourceTableType',
    'analyticsTableType',
    'sql',
] as const
