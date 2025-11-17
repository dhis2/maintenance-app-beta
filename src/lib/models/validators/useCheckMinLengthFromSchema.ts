import { createMinCharacterLength } from '@dhis2/ui'
import { SchemaFieldProperty, SchemaName } from '../../../types'
import { useSchema } from '../../schemas'

export function useCheckMinLengthFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    return checkMinLengthFromProperty(schema.properties[property])
}

export function checkMinLengthFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const minLength = propertyDetails.min
    return minLength == undefined
        ? () => undefined
        : createMinCharacterLength(minLength)
}
