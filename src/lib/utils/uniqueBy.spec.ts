import { uniqueBy } from './uniqueBy'

describe('uniqueBy', () => {
    it('should return an array with unique items based on the provided transformer function', () => {
        const inputArray = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'John' },
            { id: 4, name: 'Alice' },
        ]

        const result = uniqueBy(inputArray, (item) => item.name)

        expect(result).toEqual([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 4, name: 'Alice' },
        ])
    })

    it('should handle an empty input array', () => {
        const inputArray: any[] = []

        const result = uniqueBy(inputArray, (item) => item.name)

        expect(result).toEqual([])
    })

    it('should handle an input array with only one item', () => {
        const inputArray = [{ id: 1, name: 'John' }]

        const result = uniqueBy(inputArray, (item) => item.name)

        expect(result).toEqual([{ id: 1, name: 'John' }])
    })

    it('should handle an input array with duplicate items', () => {
        const inputArray = [
            { id: 1, name: 'John' },
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ]

        const result = uniqueBy(inputArray, (item) => item.id)

        expect(result).toEqual([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ])
    })

    it('should maintain stable ordering when encountering duplicates', () => {
        const inputArray = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'John' },
            { id: 4, name: 'Alice' },
        ]

        const result = uniqueBy(inputArray, (item) => item.name)

        expect(result).toEqual([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 4, name: 'Alice' },
        ])
    })
})
