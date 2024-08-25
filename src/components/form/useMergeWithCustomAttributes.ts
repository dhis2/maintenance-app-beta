import { useMemo } from 'react'
import {
    PartialAttributeValue,
    getAllAttributeValues,
} from '../../lib/models/attributes'
import { useCustomAttributesQuery } from './attributes'

type ModelWithAttributes = {
    attributeValues?: PartialAttributeValue[]
}

export const useMergeWithCustomAttributes = <
    TValues extends ModelWithAttributes
>(
    values?: TValues
) => {
    const customAttributes = useCustomAttributesQuery()
    return useMemo(() => {
        if (!customAttributes.data || !values) {
            return undefined
        }
        if (!('attributeValues' in values)) {
            return values
        }
        return {
            ...values,
            attributeValues: getAllAttributeValues(
                values.attributeValues || [],
                customAttributes.data
            ),
        }
    }, [customAttributes.data, values])
}
