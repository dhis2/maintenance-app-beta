import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { Attribute } from '../../../types/generated'

const CUSTOM_ATTRIBUTES_QUERY = {
    attributes: {
        resource: 'attributes',
        params: {
            fields: [
                'id',
                'mandatory',
                'displayFormName',
                'valueType',
                'optionSet[options[id,displayName,name,code]]',
            ],
            paging: false,
            filter: 'dataElementAttribute:eq:true',
        },
    },
}

interface QueryResponse {
    attributes: {
        attributes: Attribute[]
    }
}

export function useCustomAttributesQuery() {
    const customAttributes = useDataQuery<QueryResponse>(
        CUSTOM_ATTRIBUTES_QUERY
    )

    const data = useMemo(() => {
        return customAttributes.data?.attributes.attributes || []
    }, [customAttributes.data])

    return useMemo(
        () => ({
            ...customAttributes,
            data,
        }),
        [customAttributes, data]
    )
}
