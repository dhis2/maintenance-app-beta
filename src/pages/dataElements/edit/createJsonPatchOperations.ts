import get from 'lodash/fp/get'
import { JsonPatchOperation } from '../../../types'
import { DataElement } from '../../../types/generated'
import type { FormValues } from '../form'

interface FormatFormValuesArgs {
    dataElement: DataElement
    dirtyFields: { [name: string]: boolean }
    values: FormValues
}

const sanitizeDirtyValueKeys = (keys: string[]) => {
    // these are removed from the dirtyKeys
    // attributeValues is an array in the form, thus fields will be attributeValues[0] etc
    // style.code should post to style, not style.code, because it's a complex object
    const keyStartsWithToRemove = ['attributeValues', 'style'] as const
    const shouldInclude = Object.fromEntries(
        keys.map((key) => [key, false])
    ) as Record<(typeof keyStartsWithToRemove)[number], boolean>

    const keysWithout = keys.filter(
        (key) =>
            !keyStartsWithToRemove.some((keyToRemove) => {
                const shouldRemove = key.startsWith(keyToRemove)
                if (shouldRemove) {
                    shouldInclude[keyToRemove] = true
                }
                return shouldRemove
            })
    )

    // no difference
    if (keysWithout.length === keys.length) {
        return keys
    }

    const keysToInclude = Object.entries(shouldInclude)
        .filter(([, val]) => val)
        .map(([key]) => key)

    return keysWithout.concat(keysToInclude)
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

    const dirtyFieldsKeys = Object.keys(dirtyFields)
    const adjustedDirtyFieldsKeys = sanitizeDirtyValueKeys(dirtyFieldsKeys)

    return adjustedDirtyFieldsKeys.map((name) => ({
        op: get(name, dataElement) ? 'replace' : 'add',
        path: `/${name.replace(/[.]/g, '/')}`,
        value: get(name, values) || '',
    }))
}
