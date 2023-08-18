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

const columnsDefault = {
    available: [
        'name',
        'code',
        'created',
        'createdBy',
        'favorite',
        'href',
        'id',
        'lastUpdatedBy',
        'user',
    ],
    default: ['name', 'sharing', 'lastUpdated'],
} satisfies ColumnConfig

const columnsforSection: ColumnsForSection = {
    dataElement: {
        default: ['name', 'domainType', 'valueType', 'lastUpdated', 'sharing'],
    },
}

const mergeArraysUnique = <T>(...arrays: T[][]): T[] =>
    Array.from(new Set(arrays.flat()))

const mergeColumnsConfig = () => {
    const merged: MergedColumnsForSection = {}

    Object.entries(columnsforSection).forEach(
        ([sectionName, sectionColumnsMeta]) => {
            const mergedAvailable = mergeArraysUnique(
                sectionColumnsMeta.default,
                sectionColumnsMeta.available || [],
                (sectionColumnsMeta.overrideDefaultAvailable &&
                    columnsDefault.available) ||
                    []
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
        // cannot infer parent-object, see https://github.com/microsoft/TypeScript/issues/42384
        return mergedColumns[sectionName] as MergedColumnConfig
    }
    return columnsDefault
}
