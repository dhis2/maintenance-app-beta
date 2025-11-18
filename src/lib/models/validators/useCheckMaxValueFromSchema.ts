import { createMaxNumber } from '@dhis2/ui'
import { SchemaFieldProperty, SchemaName } from '../../../types'
import { useSchema } from '../../schemas'

export function useCheckMaxValueFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    return checkMaxValueFromProperty(schema.properties[property])
}

export function checkMaxValueFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const maxValue = propertyDetails.max
    return maxValue == undefined ? () => undefined : createMaxNumber(maxValue)
}
