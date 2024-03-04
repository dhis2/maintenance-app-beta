import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { Attribute } from '../../../types/generated'

const CUSTOM_ATTRIBUTES_QUERY = {
    attributes: {
        resource: 'attributes',
        params: ({ modelName }: Record<string, string>) => ({
            fields: [
                'id',
                'mandatory',
                'displayFormName',
                'valueType',
                'optionSet[options[id,displayName,name,code]]',
            ],
            paging: false,
            filter: `${modelName}Attribute:eq:true`,
        }),
    },
}

interface QueryResponse {
    attributes: {
        attributes: Attribute[]
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
