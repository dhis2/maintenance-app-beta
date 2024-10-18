import { StringParam, BooleanParam } from 'use-query-params'
import { z } from 'zod'
import { Category, DataElement } from '../../../types/generated'
import { IDENTIFIABLE_FILTER_KEY } from '../../constants'
import { isValidUid, parseAccessString } from '../../models'
import { CustomDelimitedArrayParam } from './customParams'
import { KeysOfValue } from '../../../types/utility'

const zodArrayIds = z.array(z.string().refine((val) => isValidUid(val)))

/* Zod schema for validation of the decoded params */
export const filterParamsSchema = z
    .object({
        [IDENTIFIABLE_FILTER_KEY]: z.string(),
        aggregationType: z.array(z.nativeEnum(DataElement.aggregationType)),
        categoryCombo: zodArrayIds,
        category: zodArrayIds,
        categoryOptionGroup: zodArrayIds,
        dataSet: zodArrayIds,
        domainType: z.array(z.nativeEnum(DataElement.domainType)),
        publicAccess: z.array(
            z.string().refine((val) => parseAccessString(val) !== null)
        ),
        valueType: z.array(z.nativeEnum(DataElement.valueType)),
        dataDimensionType: z.nativeEnum(Category.dataDimensionType),
        ignoreApproval: z.boolean(),
    })
    .partial()

/* useQueryParams config-map object
Mapping each filter to a config object that handles encoding/decoding */
export const filterQueryParamType = {
    [IDENTIFIABLE_FILTER_KEY]: StringParam,
    aggregationType: CustomDelimitedArrayParam,
    domainType: CustomDelimitedArrayParam,
    valueType: CustomDelimitedArrayParam,
    dataSet: CustomDelimitedArrayParam,
    category: CustomDelimitedArrayParam,
    categoryCombo: CustomDelimitedArrayParam,
    categoryOptionGroup: CustomDelimitedArrayParam,
    publicAccess: CustomDelimitedArrayParam,
    dataDimensionType: StringParam,
    ignoreApproval: BooleanParam,
} as const satisfies QueryParamsConfigMap

export const validFilterKeys = Object.keys(filterQueryParamType)

export type ParsedFilterParams = z.infer<typeof filterParamsSchema>

type MapZodTypeToQueryParamConfig<TZodResultType> =
    TZodResultType extends string
        ? typeof StringParam
        : TZodResultType extends boolean
        ? typeof BooleanParam
        : typeof CustomDelimitedArrayParam

/* Type is just used to verify that the ParamType-config matches the zod schema
Eg. that a value that is a string in zod-schema also uses StringParam for encode/decode */
type QueryParamsConfigMap = {
    [key in keyof ParsedFilterParams]-?: MapZodTypeToQueryParamConfig<
        ParsedFilterParams[key]
    >
}

export type FilterKey = keyof ParsedFilterParams
// Identifiable is not configurable, and is always shown in the list
export type ConfigurableFilterKey = Exclude<
    FilterKey,
    typeof IDENTIFIABLE_FILTER_KEY
>

export type BooleanFilterKey = KeysOfValue<
    ParsedFilterParams,
    boolean | undefined
>

export type FilterKeys = FilterKey[]
