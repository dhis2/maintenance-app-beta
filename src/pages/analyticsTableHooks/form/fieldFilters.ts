import { DEFAULT_IDENTIFIABLE } from '../../../lib'

export const fieldFilters = [
    ...DEFAULT_IDENTIFIABLE,
    'phase',
    'resourceTableType',
    'analyticsTableType',
    'sql',
] as const
