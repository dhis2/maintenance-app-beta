import get from 'lodash/fp/get'
import { JsonPatchOperation } from '../../../types'

interface FormatFormValuesArgs<FormValues> {
    originalValue: unknown
    dirtyFields: { [key in keyof FormValues]?: boolean }
    values: FormValues
}

export function createJsonPatchOperations<FormValues>({
    dirtyFields,
    originalValue,
    values,
}: FormatFormValuesArgs<FormValues>): JsonPatchOperation[] {
    return Object.keys(dirtyFields).map((name) => ({
        op: get(name, originalValue) ? 'replace' : 'add',
        path: `/${name.replace(/[.]/g, '/')}`,
        value: get(name, values) || '',
    }))
}
