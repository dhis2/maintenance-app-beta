import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { Attribute, PickWithFieldFilters } from '../../../types/generated'

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

export function useCustomAttributesQuery() {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const customAttributes = useDataQuery<QueryResponse>(
        CUSTOM_ATTRIBUTES_QUERY,
        { variables: { modelName: schemaSection.name } }
    )

    return useMemo(
        () => ({
            ...customAttributes,
            data: customAttributes.data?.attributes.attributes || [],
        }),
        [customAttributes]
    )
}
