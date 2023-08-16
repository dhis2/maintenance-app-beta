import { parsePublicAccessString } from './parsePublicAccess'

describe('parsePublicAccessString', () => {
    const validAccessCases = [
        {
            input: 'rw------',
            expected: {
                metadata: { read: true, write: true },
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
            input: 'rw------',
            expected: {
                metadata: { read: true, write: true },
                data: { read: false, write: false },
            },
        },
        {
            input: 'rwrw----',
            expected: {
                metadata: { read: true, write: true },
                data: { read: true, write: true },
            },
        },
        // Add more valid test cases here
    ]

    const invalidAccessCases = [
        '',
        'invalid',
        'r--------', // to many dashes
        'rw----x---', // Invalid character
        '-w------', // cannot have write without read
        '-r-w----',
    ]

    it.each(validAccessCases)(
        'correctly parses valid publicAccess string: $input',
        ({ input, expected }) => {
            const result = parsePublicAccessString(input)
            expect(result).toEqual(expected)
        }
    )

    it.each(invalidAccessCases)(
        'returns null for invalid publicAccess string $input',
        (testCase) => {
            const result = parsePublicAccessString(testCase)
            expect(result).toBeNull()
        }
    )
})
