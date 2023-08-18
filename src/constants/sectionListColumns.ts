import { SECTIONS_MAP, SectionName } from './sections'

interface ColumnConfig {
    available?: string[]
    overrideDefaultAvailable?: boolean
    default: string[]
}

type ColumnsForSection = {
    [key in SectionName]?: ColumnConfig
}

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
        available: ['test'],
    },
}

const mergeArraysUnique = <T>(...arrays: T[][]): T[] =>
    Array.from(new Set(arrays.flat()))

const mergeColumnsMeta = () => {
    const merged: ColumnsForSection = {}

    Object.entries(columnsforSection).forEach(
        ([section, sectionColumnsMeta]) => {
            const mergedAvailable = mergeArraysUnique(
                sectionColumnsMeta.default,
                sectionColumnsMeta.available || [],
                (sectionColumnsMeta.overrideDefaultAvailable &&
                    columnsDefault.available) ||
                    []
            )

            merged[section as SectionName] = {
                available: mergedAvailable,
                default: sectionColumnsMeta.default
                    ? sectionColumnsMeta.default
                    : columnsDefault.default,
            }
        }
    )
    return merged
}

const mergedColumns = mergeColumnsMeta()

export const getColumnsForSection = (section: SectionName): ColumnConfig => {
    if (mergedColumns[section]) {
        // cannot infer parent-object, see https://github.com/microsoft/TypeScript/issues/42384
        return mergedColumns[section] as ColumnConfig
    }
    return columnsDefault
}
