import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'

export function useCategoryCombosQuery() {
    return {
        loading: false,
        error: null,
        data: [],
        refetch: () => alert('@TODO(data element form hooks): Implement me!'),
    }
}

export function useAddCategoryComboMutation() {
    return [
        () => alert('@TODO(data element form hooks): Implement me!'),
        {
            loading: false,
            error: null,
            data: null,
        },
    ]
}

export function useOptionSetsQuery() {
    return {
        loading: false,
        error: null,
        data: [],
        refetch: () => alert('@TODO(data element form hooks): Implement me!'),
    }
}

export function useAddOptionSetMutation() {
    return [
        () => alert('@TODO(data element form hooks): Implement me!'),
        {
            loading: false,
            error: null,
            data: null,
        },
    ]
}

export function useCommentOptionSetsQuery() {
    return {
        loading: false,
        error: null,
        data: [],
        refetch: () => alert('@TODO(data element form hooks): Implement me!'),
    }
}

export function useAddCommentOptionSetMutation() {
    return [
        () => alert('@TODO(data element form hooks): Implement me!'),
        {
            loading: false,
            error: null,
            data: null,
        },
    ]
}

export function useLegendSetQuery() {
    return {
        loading: false,
        error: null,
        data: [],
        refetch: () => alert('@TODO(data element form hooks): Implement me!'),
    }
}

export function useAddLegendMutation() {
    return [
        () => alert('@TODO(data element form hooks): Implement me!'),
        {
            loading: false,
            error: null,
            data: null,
        },
    ]
}

export function useAggregationLevelsQuery() {
    return {
        loading: false,
        error: null,
        data: [],
        refetch: () => alert('@TODO(data element form hooks): Implement me!'),
    }
}

export function useAddAggregationLevelMutation() {
    return [
        () => alert('@TODO(data element form hooks): Implement me!'),
        {
            loading: false,
            error: null,
            data: null,
        },
    ]
}

const CUSTOM_ATTRIBUTES_QUERY = {
    attributes: {
        resource: 'attributes',
        params: {
            fields: ['*', 'optionSet[*]'],
            paging: false,
            filter: 'dataElementAttribute:eq:true',
        },
    },
}

// @TODO(useCustomAttributesQuery): create response type
interface QueryResponse {
    attributes: {
        attributes: Array<{
            id: string
            displayFormName: string
            // @TODO(CustomAttributes): Implement all possible value types!
            valueType: 'TEXT' | 'LONG_TEXT'
            code: string
            mandatory: boolean
        }>
    }
}

export function useCustomAttributesQuery() {
    const customAttributes = useDataQuery<QueryResponse>(
        CUSTOM_ATTRIBUTES_QUERY
    )

    const data = useMemo(() => {
        return (
            customAttributes.data?.attributes.attributes.map((attribute) => {
                return attribute
            }) || []
        )
    }, [customAttributes.data])

    return useMemo(
        () => ({
            ...customAttributes,
            data,
        }),
        [customAttributes, data]
    )
}
