import { StringParam } from 'use-query-params'
import { z } from 'zod'
import { DataElement } from '../../../types/generated'
import { IDENTIFIABLE_KEY } from '../../constants'
import { isValidUid } from '../../models'
import { CustomDelimitedArrayParam } from './customParams'

const zodArrayIds = z.array(z.string().refine((val) => isValidUid(val)))

/* Zod schema for validation of the decoded params */
export const filterParamsSchema = z
    .object({
        [IDENTIFIABLE_KEY]: z.string(),
        aggregationType: z.array(z.nativeEnum(DataElement.aggregationType)),
        categoryCombo: zodArrayIds,
        dataSet: zodArrayIds,
        domainType: z.array(z.nativeEnum(DataElement.domainType)),
        valueType: z.array(z.nativeEnum(DataElement.valueType)),
    })
    .partial()

/* useQueryParams config-map object
Mapping each filter to a config object that handles encoding/decoding */
export const filterQueryParamType = {
    [IDENTIFIABLE_KEY]: StringParam,
    aggregationType: CustomDelimitedArrayParam,
    domainType: CustomDelimitedArrayParam,
    valueType: CustomDelimitedArrayParam,
    dataSet: CustomDelimitedArrayParam,
    categoryCombo: CustomDelimitedArrayParam,
} as const satisfies QueryParamsConfigMap

export const validFilterKeys = Object.keys(filterQueryParamType)

export type ParsedFilterParams = z.infer<typeof filterParamsSchema>

type MapZodTypeToQueryParamConfig<TZodResultType> =
    TZodResultType extends string
        ? typeof StringParam
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
export type ConfigurableFilterKey = Exclude<FilterKey, typeof IDENTIFIABLE_KEY>
export type FilterKeys = FilterKey[]
