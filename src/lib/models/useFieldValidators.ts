import { createMaxNumber, createMinNumber, Validator } from '@dhis2/ui'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SchemaFieldProperty, SchemaSection } from '../../types'
import { composeAsyncValidators, required } from '../form'
import { useSchema } from '../schemas'
import { checkMaxLengthFromProperty } from './useCheckMaxLengthFromSchema'
import { useIsFieldValueUnique } from './useIsFieldValueUnique'

export function checkMaxValueFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const maxValue = propertyDetails.max
    return maxValue == undefined ? () => undefined : createMaxNumber(maxValue)
}

export function checkMinValueFromProperty(
    propertyDetails: SchemaFieldProperty
): (value: unknown) => string | undefined {
    const minValue = propertyDetails.min
    return minValue == undefined ? () => undefined : createMinNumber(minValue)
}

export function useValidator({
    schemaSection,
    property,
}: {
    schemaSection: SchemaSection
    property: string
}) {
    const schema = useSchema(schemaSection.name)
    const propertyDetails = schema.properties[property]

    const validators = useMemo(() => [] as Validator[], [])
    const params = useParams()
    const modelId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: property,
        id: modelId,
    }) as Validator
    if (propertyDetails.propertyType !== 'INTEGER' && propertyDetails.length) {
        validators.push(checkMaxLengthFromProperty(propertyDetails))
    }
    if (propertyDetails.unique) {
        validators.push(checkIsValueTaken)
    }
    if (propertyDetails.required) {
        validators.push(required)
    }
    if (propertyDetails.propertyType === 'INTEGER' && propertyDetails.max) {
        validators.push(checkMaxValueFromProperty(propertyDetails))
    }
    if (propertyDetails.propertyType === 'INTEGER' && propertyDetails.min) {
        validators.push(checkMinValueFromProperty(propertyDetails))
    }

    return useMemo(
        () => composeAsyncValidators<string>(validators),
        [validators]
    )
}
