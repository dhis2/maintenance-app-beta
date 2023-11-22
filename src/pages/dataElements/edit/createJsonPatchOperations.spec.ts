import {
    sanitizeDirtyValueKeys,
    createJsonPatchOperations,
} from './createJsonPatchOperations'

describe('createJsonPatchOperations', () => {
    describe('sanitizeDirtyValueKeys', () => {
        it('should return the dirty values array as is', () => {
            const actual = sanitizeDirtyValueKeys(['foo', 'bar'])
            const expected = ['foo', 'bar']
            expect(actual).toEqual(expected)
        })

        it('should remove all attribute values changes and add a single "attributeValues"', () => {
            const actual = sanitizeDirtyValueKeys([
                'foo',
                'bar',
                'attributeValues[0].value',
                'attributeValues[1].value',
            ])
            const expected = ['foo', 'bar', 'attributeValues']
            expect(actual).toEqual(expected)
        })

        it('should remove style.icon and style.color changes and add a single "style"', () => {
            const actual = sanitizeDirtyValueKeys([
                'foo',
                'bar',
                'style.color',
                'style.icon',
            ])
            const expected = ['foo', 'bar', 'style']
            expect(actual).toEqual(expected)
        })
    })

    describe('createJsonPatchOperations', () => {
        it('should return an empty array if no dirty fields', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: {},
                originalValue: {
                    id: 'foo',
                    attributeValues: [],
                },
                values: {
                    attributeValues: [],
                },
            })
            expect(actual).toEqual([])
        })

        it('should return a json-patch payload for a single field', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: {
                    name: true,
                },
                originalValue: {
                    id: 'foo',
                    name: 'bar',
                    attributeValues: [],
                },
                values: {
                    name: 'baz',
                    attributeValues: [],
                },
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
                dirtyFields: {
                    name: true,
                },
                originalValue: {
                    id: 'foo',
                    attributeValues: [],
                },
                values: {
                    name: 'baz',
                    attributeValues: [],
                },
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

        it('should handle attributeValues', () => {
            const actual = createJsonPatchOperations({
                dirtyFields: {
                    attributeValues: true,
                },
                originalValue: {
                    id: 'foo',
                    name: 'bar',
                    attributeValues: [],
                },
                values: {
                    name: 'baz',
                    attributeValues: [
                        { value: 'INPUT', attribute: { id: 'foo' } },
                    ],
                },
            })
            const expected = [
                {
                    op: 'replace',
                    path: '/attributeValues',
                    value: [{ value: 'INPUT', attribute: { id: 'foo' } }],
                },
            ]
            expect(actual).toEqual(expected)
        })
    })
})
