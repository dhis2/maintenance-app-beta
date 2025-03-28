import type {
    AttributeValue,
    PickWithFieldFilters,
} from '../../../types/generated'
import { getInititalValueForValueType } from '../valueType'
import { AttributeMetadata } from './useCustomAttributesQuery'

export type PartialAttributeValue = PickWithFieldFilters<
    AttributeValue,
    ['attribute[id]', 'value']
>

/* Gather all assigned attributes from both model.attributeValues and attributes.
   Normally a metadata model will only return attributes with a value. 
   However, in a form we should still show assigned attributes, so the user can edit them */
export const getAllAttributeValues = <
    TAttributeValue extends PartialAttributeValue
>(
    modelAttributeValues: TAttributeValue[],
    attributes: AttributeMetadata[]
) => {
    const attributeValuesMap = new Map(
        modelAttributeValues.map((a) => [a.attribute.id, a])
    )

    const attributeValues = attributes.map((attribute) => {
        const value =
            attributeValuesMap.get(attribute.id)?.value ||
            getInititalValueForValueType(attribute.valueType)
        return { attribute, value }
    })

    return attributeValues
}
