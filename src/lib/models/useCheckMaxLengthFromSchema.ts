import { createMaxCharacterLength } from '@dhis2/ui'
import { useMemo } from 'react'
import { SchemaFieldProperty, SchemaName } from '../../types'
import { useSchema } from '../schemas'

export function useCheckMaxLengthFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    return useCheckMaxLengthFromPropriety(schema.properties[property])
}

export function useCheckMaxLengthFromPropriety(
    proprietyDetails: SchemaFieldProperty
) {
    const maxLength = proprietyDetails.length
    const checkMaxLength = useMemo(
        () =>
            maxLength == undefined
                ? () => undefined
                : createMaxCharacterLength(maxLength),
        [maxLength]
    )

    return checkMaxLength
}
