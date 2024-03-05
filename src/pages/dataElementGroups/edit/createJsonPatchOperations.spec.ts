import { createJsonPatchOperations } from './createJsonPatchOperations'

describe('createJsonPatchOperations', () => {
    describe('createJsonPatchOperations', () => {
        it('should return an empty array if no dirty fields', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: {},
                originalValue: { id: 'foo' },
                values: {},
            })
            expect(actual).toEqual([])
        })

        it('should return a json-patch payload for a single field', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: { name: true },
                originalValue: {
                    id: 'foo',
                    name: 'bar',
                },
                values: { name: 'baz' },
            })
            const expected = [
                {
                    op: 'replace',
                    path: '/name',
                    value: 'baz',
                },
            ]
            expect(actual).toEqual(expected)
        })

        it('should return a json-patch payload with add if value does not exist in originalValue', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: { name: true },
                originalValue: { id: 'foo' },
                values: { name: 'baz' },
            })
            const expected = [
                {
                    op: 'add',
                    path: '/name',
                    value: 'baz',
                },
            ]
            expect(actual).toEqual(expected)
        })
    })
})
