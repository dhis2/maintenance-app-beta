import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { Attribute, PickWithFieldFilters } from '../../../types/generated'
import { useSectionHandle } from '../../routeUtils'

const attributeFields = [
    'id',
    'mandatory',
    'displayFormName',
    'valueType',
    'optionSet[options[id,displayName,name,code]]',
] as const

export type AttributeMetadata = PickWithFieldFilters<
    Attribute,
    typeof attributeFields
>

const CUSTOM_ATTRIBUTES_QUERY = {
    attributes: {
        resource: 'attributes',
        params: ({ modelName }: Record<string, string>) => ({
            fields: attributeFields.concat(),
            paging: false,
            filter: `${modelName}Attribute:eq:true`,
        }),
    },
}

interface QueryResponse {
    attributes: {
        attributes: AttributeMetadata[]
    }
}

type UseCustomAttributesQueryOptions = {
    enabled?: boolean
}
export function useCustomAttributesQuery({
    enabled = true,
}: UseCustomAttributesQueryOptions = {}) {
    const schemaSection = useSectionHandle()

    const customAttributes = useDataQuery<QueryResponse>(
        CUSTOM_ATTRIBUTES_QUERY,
        {
            lazy: !enabled,
            variables: { modelName: schemaSection?.name },
        }
    )

    return useMemo(
        () => ({
            ...customAttributes,
            data: customAttributes.data?.attributes.attributes || [],
        }),
        [customAttributes]
    )
}
