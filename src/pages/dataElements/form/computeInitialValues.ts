import { Attribute, DataElement } from '../../../types/generated'

export function computeInitialValues({
    dataElement,
    customAttributes,
}: {
    dataElement: DataElement
    customAttributes: Attribute[]
}) {
    const customAttributeInitialValues = customAttributes.reduce(
        (acc, customAttribute) => {
            const attributeValue = dataElement.attributeValues.find(
                (currentAttribute) =>
                    customAttribute.id === currentAttribute.attribute.id
            )

            if (!attributeValue?.value) {
                return { ...acc, [customAttribute.id]: '' }
            }

            if (typeof customAttribute.optionSet?.options === 'undefined') {
                return { ...acc, [customAttribute.id]: attributeValue?.value }
            }

            const selectedOption = customAttribute.optionSet.options.find(
                (option) => option.code === attributeValue.value
            )

            if (!selectedOption) {
                return { ...acc, [customAttribute.id]: '' }
            }

            return {
                ...acc,
                [customAttribute.id]: selectedOption.code,
            }
        },
        {}
    )

    return {
        name: dataElement.name,
        shortName: dataElement.shortName,
        code: dataElement.code,
        description: dataElement.description,
        url: dataElement.url,
        color: dataElement.style?.color,
        icon: dataElement.style?.icon,
        fieldMask: dataElement.fieldMask,
        domainType: dataElement.domainType,
        formName: dataElement.formName,
        valueType: dataElement.valueType,
        aggregationType: dataElement.aggregationType,
        categoryCombo: '', // dataElement.categoryCombo?.id,
        optionSet: '', // dataElement.optionSet,
        commentOptionSet: '', // dataElement.commentOptionSet,
        legendSet: [], // dataElement.legendSet || [],
        aggregationLevels: [], // dataElement.aggregationLevels || [],
        attributeValues: customAttributeInitialValues,
    }
}
