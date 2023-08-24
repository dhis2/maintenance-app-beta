import '@testing-library/jest-dom'
import { getRelativeTime, getRelativeTimeFromDelta } from './relativeTime' // Update this path

jest.mock('@dhis2/d2-i18n', () => ({ language: 'en' }))

describe('getRelativeTime', () => {
    it('should return a valid relative time message', () => {
        const now = new Date()
        const pastDate = new Date(now.getTime() - 2 * 60 * 1000) // 2 minutes ago
        const result = getRelativeTime(pastDate, now)
        expect(result).toBeDefined()
    })

    it('should return "now "when over 24hrs ago', () => {
        const now = new Date()
        const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 2 minutes ago
        const result = getRelativeTime(pastDate, now)
        expect(result).toBeDefined()
        expect(result).toEqual('1 day ago')
    })
})

describe('getRelativeTimeFromDelta', () => {
    describe('return closest unit', () => {
        it('year when over a year', () => {
            const twoYears = 2 * 365 * 24 * 60 * 60 * 1000
            const result = getRelativeTimeFromDelta(-twoYears)
            expect(result).toEqual('2 years ago')
        })
        it('months when less than a year', () => {
            const months12 = 364 * 24 * 60 * 60 * 1000
            const result = getRelativeTimeFromDelta(-months12)
            expect(result).toEqual('12 months ago')
            const months11 = 340 * 24 * 60 * 60 * 1000
            expect(getRelativeTimeFromDelta(-months11)).toEqual('11 months ago')
        })

        it('day when less than a month', () => {
            const days30 = 30 * 24 * 60 * 60 * 1000
            const result = getRelativeTimeFromDelta(-days30)
            expect(result).toEqual('30 days ago')
            const days29 = 29 * 24 * 60 * 60 * 1000
            expect(getRelativeTimeFromDelta(-days29)).toEqual('29 days ago')
            const days1 = 24 * 60 * 60 * 1000
            expect(getRelativeTimeFromDelta(-days1)).toEqual('1 day ago')
        })
        it('hours when less than a day', () => {
            const hours23 = 23 * 60 * 60 * 1000
            const result = getRelativeTimeFromDelta(-hours23)
            expect(result).toEqual('23 hours ago')

            const hours1 = 60 * 60 * 1000
            expect(getRelativeTimeFromDelta(-hours1)).toEqual('1 hour ago')
        })

        it('minutes when less than an hour', () => {
            const minutes59 = 59 * 60 * 1000
            const result = getRelativeTimeFromDelta(-minutes59)
            expect(result).toEqual('59 minutes ago')

            const minutes1 = 60 * 1000
            expect(getRelativeTimeFromDelta(-minutes1)).toEqual('1 minute ago')
        })

        it('seconds when less than a minute', () => {
            const seconds59 = 59 * 1000
            const result = getRelativeTimeFromDelta(-seconds59)
            expect(result).toEqual('59 seconds ago')

            const seconds1 = 1 * 1000
            expect(getRelativeTimeFromDelta(-seconds1)).toEqual('1 second ago')
        })
    })

    it('should return a valid relative time message for positive delta', () => {
        const result = getRelativeTimeFromDelta(60000 * 2) // 2 minutes
        expect(result).toBeDefined()
        expect(result).toEqual('in 2 minutes')
    })

    it('should return a valid relative time message for negative delta', () => {
        const result = getRelativeTimeFromDelta(-3600000 * 2) // 2 hour ago
        expect(result).toBeDefined()
        expect(result).toEqual('2 hours ago')
    })
})
