import { createTestNames } from '../createTestNames'

describe('createTestNames', () => {
    it('should prepend the prefix to all provided names', () => {
        const actual = createTestNames('foo', 'bar', 'foobar-baz')
        const expected =
            'datatest-dhis2-maintenance-foo datatest-dhis2-maintenance-bar datatest-dhis2-maintenance-foobar-baz'

        expect(actual).toBe(expected)
    })

    it('should return an empty string when called with no names', () => {
        expect(createTestNames()).toBe('')
    })
})
