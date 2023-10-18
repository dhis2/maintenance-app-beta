import { getIn, getFieldFilterFromPath } from './path'

describe('path', () => {
    describe('getIn', () => {
        it('should return the value at the specified nested path', () => {
            const obj = {
                user: {
                    name: 'John',
                    address: {
                        city: 'New York',
                        zip: '10001',
                    },
                },
            }

            const result = getIn(obj, 'user.address.city')
            expect(result).toBe('New York')
        })

        it('should return undefined for non-existent paths', () => {
            const obj = {
                user: {
                    name: 'John',
                },
            }

            const result = getIn(obj, 'user.address.city')
            expect(result).toBeUndefined()
        })

        it('should handle an array path', () => {
            const obj = {
                user: {
                    name: 'John',
                    address: {
                        city: 'New York',
                        zip: '10001',
                    },
                },
            }

            const result = getIn(obj, ['user', 'address', 'zip'])
            expect(result).toBe('10001')
        })

        it('should handle null and undefined objects gracefully', () => {
            const obj = null

            const result = getIn(obj, 'user.address.city')
            expect(result).toBeUndefined()
        })

        it('should handle null and undefined properties gracefully', () => {
            const obj = {
                user: {
                    name: 'John',
                    address: null,
                },
            }

            const result = getIn(obj, 'user.address.city')
            expect(result).toBeUndefined()
        })
    })

    describe('getFieldFilterFromPath', () => {
        it('should return the path as is for a single part', () => {
            const path = 'name'
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('name')
        })

        it('should return the path with square brackets for nested paths', () => {
            const pathArr = ['user', 'address', 'city']
            const path = 'user.address.city'
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('user[address[city]]')

            const resultArr = getFieldFilterFromPath(pathArr)
            expect(resultArr).toBe(result)
        })

        it('should handle a nested path with a single part', () => {
            const path = 'user.age'
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('user[age]')

            const pathArr = ['user', 'age']
            const resultArr = getFieldFilterFromPath(pathArr)
            expect(resultArr).toBe(result)
        })

        it('should handle a deeply nested path', () => {
            const path = 'a.b.c.d.e'
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('a[b[c[d[e]]]]')

            const pathArr = ['a', 'b', 'c', 'd', 'e']
            const resultArr = getFieldFilterFromPath(pathArr)
            expect(resultArr).toBe(result)
        })

        it('should handle a path with a single part enclosed in square brackets', () => {
            const path = '[user]'
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('[user]')
        })

        it('should handle an empty path', () => {
            const path: string[] = []
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('')
        })

        it('should handle a path with empty string parts', () => {
            const path = ['', 'user', '', 'address', 'city']
            const result = getFieldFilterFromPath(path)
            expect(result).toBe('user[address[city]]')
        })

        it('should drop nested fields if maxDepth is 0', () => {
            const path = 'sharing.public'
            const result = getFieldFilterFromPath(path, 0)
            expect(result).toBe('sharing')

            const pathArr = ['sharing', 'public']
            const resultArr = getFieldFilterFromPath(pathArr, 0)
            expect(resultArr).toBe(result)
        })

        it('should drop nested fields according to maxDepth', () => {
            const path = 'sharing.public'

            const result = getFieldFilterFromPath(path, 1)

            expect(result).toBe('sharing[public]')

            const deCatComboPath = 'dataElement.categoryCombo.id'
            const resultDepth1 = getFieldFilterFromPath(deCatComboPath, 1)

            expect(resultDepth1).toBe('dataElement[categoryCombo]')

            const resultDepth2 = getFieldFilterFromPath(deCatComboPath, 2)
            expect(resultDepth2).toBe('dataElement[categoryCombo[id]]')

            const resultDepth3 = getFieldFilterFromPath(deCatComboPath, 3)
            expect(resultDepth3).toBe('dataElement[categoryCombo[id]]')
        })
    })
})
