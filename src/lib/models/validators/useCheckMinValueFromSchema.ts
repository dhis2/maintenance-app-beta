import { createMinNumber } from '@dhis2/ui'
import { SchemaFieldProperty, SchemaName } from '../../../types'
import { useSchema } from '../../schemas'

export function useCheckMinValueFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    return checkMinValueFromProperty(schema.properties[property])
}

export function checkMinValueFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const minValue = propertyDetails.min
    return minValue == undefined ? () => undefined : createMinNumber(minValue)
}
