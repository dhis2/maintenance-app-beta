import { createMaxCharacterLength } from '@dhis2/ui'
import { SchemaFieldProperty, SchemaName } from '../../types'
import { useSchema } from '../schemas'

export function useCheckMaxLengthFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    return checkMaxLengthFromProperty(schema.properties[property])
}

export function checkMaxLengthFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const maxLength = propertyDetails.length
    return maxLength == undefined
        ? () => undefined
        : createMaxCharacterLength(maxLength)
}
