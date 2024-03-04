import { createMaxCharacterLength } from '@dhis2/ui'
import { useMemo } from 'react'
import { SchemaName } from '../../types'
import { useSchema } from '../schemas'

export function useCheckMaxLengthFromSchema(
    model: SchemaName,
    property: string
) {
    const schema = useSchema(model)
    const maxLength = schema.properties[property].length
    const checkMaxLength = useMemo(
        () =>
            maxLength == undefined
                ? () => undefined
                : createMaxCharacterLength(maxLength),
        [maxLength]
    )

    return checkMaxLength
}
