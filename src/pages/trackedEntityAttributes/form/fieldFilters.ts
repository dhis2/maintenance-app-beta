import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'shortName',
    'formName',
    'code',
    'description',
    'optionSet[id,displayName,valueType]',
    'valueType',
    'trackedEntityType[id,displayName]',
    'unique',
    'orgunitScope',
    'generated',
    'pattern',
    'fieldMask',
    'confidential',
    'inherit',
    'displayInListNoProgram',
    'skipSynchronization',
    // TODO: Uncomment when version control is implemented (v43+)
    // 'trigramIndexable',
    // 'trigramIndexed',
    'preferredSearchOperator',
    'blockedSearchOperators',
    'minimumCharactersToSearch',
    'aggregationType',
    'legendSets[id,displayName]',
] as const
