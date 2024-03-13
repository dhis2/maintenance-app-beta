import { useCallback } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { z } from 'zod'
import { getSchemaPropertyForPath } from '../models/path'
import { useSchemaFromHandle } from '../schemas'
import { Schema } from '../useLoadApp'

const SortQueryParam = StringParam

const sortOrderDirections = ['asc', 'desc'] as const

export type SortOrderDirection = (typeof sortOrderDirections)[number]

const sortOrderStringSchema = z
    .string()
    .refine((value) => value.split(':').length === 2)
    .transform((value) => value.split(':'))
    .pipe(
        z.tuple([
            z.string(), // columnPath
            z.enum(sortOrderDirections), // order
        ])
    )

export type ParsedSortOrder = z.infer<typeof sortOrderStringSchema>

const parseSortOrderString = (
    value: string | undefined | null
): ParsedSortOrder | undefined => {
    const parsed = sortOrderStringSchema.safeParse(value)
    if (parsed.success) {
        return parsed.data
    }
    return undefined
}

const formatSortOrderToString = (value: ParsedSortOrder): string =>
    `${value[0]}:${value[1]}`

export const isValidSortPathForSchema = (schema: Schema, path: string) => {
    const schemaProperty = getSchemaPropertyForPath(schema, path)

    // sorting for metadata-API only works on simple and persisted properties
    if (schemaProperty && schemaProperty.simple && schemaProperty.persisted) {
        return true
    }
    return false
}

export const useSectionListSortOrder = () => {
    const schema = useSchemaFromHandle()
    const [sortOrderParam, setSortOrderParam] = useQueryParam(
        'sort',
        SortQueryParam,
        { removeDefaultsFromUrl: true }
    )

    const setSortOrder = useCallback(
        (value: ParsedSortOrder | undefined) => {
            setSortOrderParam(
                value ? formatSortOrderToString(value) : undefined
            )
        },
        [setSortOrderParam]
    )
    let parsedSortOrder = parseSortOrderString(sortOrderParam)

    if (parsedSortOrder) {
        const [path] = parsedSortOrder
        if (!isValidSortPathForSchema(schema, path)) {
            parsedSortOrder = undefined
        }
    }

    return [parsedSortOrder, setSortOrder] as const
}

export const useSortOrderQueryParams = () => {
    const [sortOrder] = useSectionListSortOrder()

    return sortOrder ? formatSortOrderToString(sortOrder) : undefined
}
