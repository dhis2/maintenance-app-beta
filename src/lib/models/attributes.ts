import type {
    IdentifiableObject,
    Attribute,
    AttributeValue,
} from '../../types/generated'

/* Gather all assigned attributes from both model.attributeValues and attributes.
   Normally a metadata model will only return attributes with a value. 
   However, in a form we should still show assigned attributes, so the user can edit them */
export const getAllAttributeValues = (
    modelAttributeValues: AttributeValue[],
    attributes: Attribute[]
): AttributeValue[] => {
    const attributeValuesMap = new Map(
        modelAttributeValues.map((a) => [a.attribute.id, a])
    )

    const attributeValues: AttributeValue[] = attributes.map((attribute) => {
        const value = attributeValuesMap.get(attribute.id)?.value || ''
        return { attribute, value }
    })

    return attributeValues
}
