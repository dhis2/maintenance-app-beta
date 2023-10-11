import get from 'lodash/fp/get'
import { JsonPatchOperation } from '../../../types'
import { DataElement } from '../../../types/generated'
import type { FormValues } from '../form'

type DataElementKey = keyof DataElement

interface FormatFormValuesArgs {
    dataElement: DataElement
    dirtyFields: { [name: string]: boolean }
    values: FormValues
}

const sanitizeDirtyValueKeys = (keys: DataElementKey[]) => {
    const attributeValuesDirty = keys.find((key) =>
        key.startsWith('attributeValues')
    )

    if (!attributeValuesDirty) {
        return keys
    }

    return [
        ...keys.filter((key) => !key.startsWith('attributeValues')),
        'attributeValues' as DataElementKey,
    ]
}

export function createJsonPatchOperations({
    dirtyFields,
    dataElement,
    values: unsanitizedValues,
}: FormatFormValuesArgs): JsonPatchOperation[] {
    // Remove attribute values without a value
    const values = {
        ...unsanitizedValues,
        attributeValues: unsanitizedValues.attributeValues.filter(
            ({ value }) => !!value
        ),
    }

    const dirtyFieldsKeys = Object.keys(dirtyFields) as DataElementKey[]
    const adjustedDirtyFieldsKeys: DataElementKey[] =
        sanitizeDirtyValueKeys(dirtyFieldsKeys)

    return adjustedDirtyFieldsKeys.map((name) => ({
        op: get(name, dataElement) ? 'replace' : 'add',
        path: `/${name.replace(/[.]/g, '/')}`,
        value: get(name, values),
    }))
}
