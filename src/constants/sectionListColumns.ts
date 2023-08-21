import { SECTIONS_MAP, SectionName } from './sections'

interface ColumnConfig {
    available?: string[]
    overrideDefaultAvailable?: boolean
    default: string[]
}

interface MergedColumnConfig {
    available: string[]
    default: string[]
}

type ColumnsForSection = {
    [key in SectionName]?: ColumnConfig
}

type MergedColumnsForSection = Record<string, MergedColumnConfig>

// list of modelProperties to show in List
// this is the default that all columns that are not specified
// in columnsForSection below
const columnsDefault = {
    available: [
        'name',
        'shortName',
        'code',
        'created',
        'createdBy',
        'href',
        'id',
        'lastUpdatedBy',
    ],
    default: ['name', 'sharing', 'lastUpdated'],
} satisfies ColumnConfig

// this is the default columns shown in the list for each section
// Note: by default, the available columns are merged with columnsDefault.available above.
// If it's needed to override this for a section, set overrideDefaultAvailable to true
// and list all available columns in the available array below.
// Default-list will NOT be merged with columnsDefault.default - list all explicitly.
// elements in the default array implies they are also available, no need to list them in both.
const columnsForSection: ColumnsForSection = {
    dataElement: {
        default: ['name', 'domainType', 'valueType', 'lastUpdated', 'sharing'],
        available: ['zeroIsSignificant', 'categoryCombo'],
    },
}

const mergeArraysUnique = <T>(...arrays: T[][]): T[] =>
    Array.from(new Set(arrays.flat()))

const mergeColumnsConfig = () => {
    const merged: MergedColumnsForSection = {}

    Object.entries(columnsForSection).forEach(
        ([sectionName, sectionColumnsMeta]) => {
            const mergedAvailable = mergeArraysUnique(
                sectionColumnsMeta.default,
                sectionColumnsMeta.available || [],
                sectionColumnsMeta.overrideDefaultAvailable
                    ? []
                    : columnsDefault.available
            )

            merged[sectionName] = {
                available: mergedAvailable,
                default: sectionColumnsMeta.default
                    ? sectionColumnsMeta.default
                    : columnsDefault.default,
            }
        }
    )
    return merged
}

const mergedColumns = mergeColumnsConfig()

export const getColumnsForSection = (
    sectionName: string
): MergedColumnConfig => {
    if (mergedColumns[sectionName]) {
        return mergedColumns[sectionName]
    }
    return columnsDefault
}
