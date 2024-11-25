import { Validator } from '@dhis2/ui'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SchemaFieldPropertyType, SchemaSection } from '../../types'
import { composeAsyncValidators, required } from '../form'
import { useSchema } from '../schemas'
import { checkMaxLengthFromProperty } from './useCheckMaxLengthFromSchema'
import { useIsFieldValueUnique } from './useIsFieldValueUnique'

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
    const checkMaxLength = checkMaxLengthFromProperty(propertyDetails)
    const checkIsValueTaken = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: property,
        id: modelId,
    }) as Validator
    if (propertyDetails.length) {
        validators.push(checkMaxLength)
    }
    if (propertyDetails.unique) {
        validators.push(checkIsValueTaken)
    }
    if (propertyDetails.required) {
        validators.push(required)
    }

    return useMemo(
        () => composeAsyncValidators<string>(validators),
        [validators]
    )
}
