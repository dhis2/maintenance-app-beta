import get from 'lodash/fp/get'
import { JsonPatchOperation } from '../../types'
import {
    Attribute,
    AttributeValue,
    IdentifiableObject,
} from './../../types/generated/models'

type PatchAttribute = {
    id: Attribute['id']
}

type PatchAttributeValue = {
    attribute: PatchAttribute
    value: AttributeValue['value']
}

export type ModelWithAttributeValues = {
    id?: string
    attributeValues?: PatchAttributeValue[]
}

interface FormatFormValuesArgs<FormValues extends ModelWithAttributeValues> {
    originalValue: unknown
    dirtyFields: Record<string, boolean>
    values: FormValues
    omit?: string[]
}

// these are removed from the dirtyKeys
// attributeValues is an array in the form, thus the key will be attributeValues[0] etc
// remove these, and replace with 'attributeValues'
// style.code should post to style, not style.code, because it's a complex object
const complexKeys = ['attributeValues', 'style'] as const
export const sanitizeDirtyValueKeys = (dirtyKeys: string[]) => {
    const complexChanges = complexKeys.filter((complexKey) =>
        dirtyKeys.some((dirtyKey) => dirtyKey.startsWith(complexKey))
    )

    const dirtyKeysWithoutComplexKeys = dirtyKeys.filter(
        (dirtyKey) =>
            !complexChanges.some((complexKey) =>
                dirtyKey.startsWith(complexKey)
            )
    )

    return dirtyKeysWithoutComplexKeys.concat(complexChanges)
}

export function createJsonPatchOperations<
    FormValues extends ModelWithAttributeValues
>({
    dirtyFields,
    originalValue,
    values: unsanitizedValues,
    omit,
}: FormatFormValuesArgs<FormValues>): JsonPatchOperation[] {
    // Remove attribute values without a value
    const values = {
        ...unsanitizedValues,
        ...(unsanitizedValues.attributeValues && {
            attributeValues: unsanitizedValues.attributeValues.filter(
                ({ value }) => !!value
            ),
        }),
    }

    const dirtyFieldsKeys = Object.keys(dirtyFields)
    const adjustedDirtyFieldsKeys = sanitizeDirtyValueKeys(
        dirtyFieldsKeys
    ).filter((key) => !omit?.includes(key))

    return adjustedDirtyFieldsKeys.map((name) => ({
        op: get(name, originalValue) ? 'replace' : 'add',
        path: `/${name.replace(/[.]/g, '/')}`,
        value: get(name, values) || null,
    }))
}
