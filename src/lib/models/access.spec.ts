import { parseAccessString } from './access'

describe('parseAccessString', () => {
    const validAccessCases = [
        {
            input: '--------',
            expected: {
                metadata: { read: false, write: false },
                data: { read: false, write: false },
            },
        },
        {
            input: 'r-------',
            expected: {
                metadata: { read: true, write: false },
                data: { read: false, write: false },
            },
        },
        {
            input: 'rw------',
            expected: {
                metadata: { read: true, write: true },
                data: { read: false, write: false },
            },
        },
        {
            input: '--r-----',
            expected: {
                metadata: { read: false, write: false },
                data: { read: true, write: false },
            },
        },
        {
            input: '--rw----',
            expected: {
                metadata: { read: false, write: false },
                data: { read: true, write: true },
            },
        },
        {
            input: 'rwrw----',
            expected: {
                metadata: { read: true, write: true },
                data: { read: true, write: true },
            },
        },
    ]

    const invalidAccessCases = [
        '',
        'invalid',
        'r--------', // too many dashes
        'rxrw----', // invalid character
        '-w------', // cannot have write without read
        '-r-w----',
        'rwrwrwrw',
    ]

    it.each(validAccessCases)(
        'correctly parses valid publicAccess string: $input',
        ({ input, expected }) => {
            const result = parseAccessString(input)
            expect(result).toEqual(expected)
        }
    )

    it.each(invalidAccessCases)(
        'returns null for invalid publicAccess string $input',
        (testCase) => {
            const result = parseAccessString(testCase)
            expect(result).toBeNull()
        }
    )
})
