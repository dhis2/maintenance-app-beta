import { filterIcons } from './filterIcons'

describe('filterIcons', () => {
    const icons = [
        {
            key: 'foo',
            description: 'First description',
            keywords: ['keyword1', 'Keyword2'],
            href: '',
        },
        {
            key: 'bar',
            description: 'Second description',
            keywords: ['keyword3', 'Keyword2'],
            href: '',
        },
        {
            key: 'baz',
            description: 'third description',
            keywords: ['keyword4', 'Keyword5'],
            href: '',
        },
    ]

    it('should not filter when there is no filter text', () => {
        expect(filterIcons(icons, '')).toBe(icons)
    })

    it('should filter when the key matches the filter', () => {
        expect(filterIcons(icons, 'Foo')).toEqual([
            {
                key: 'foo',
                description: 'First description',
                keywords: ['keyword1', 'Keyword2'],
                href: '',
            },
        ])
    })

    it('should filter when the description matches the filter', () => {
        expect(filterIcons(icons, 'first')).toEqual([
            {
                key: 'foo',
                description: 'First description',
                keywords: ['keyword1', 'Keyword2'],
                href: '',
            },
        ])
    })

    it('should filter when a keyword matches the filter', () => {
        expect(filterIcons(icons, 'keyword2')).toEqual([
            {
                key: 'foo',
                description: 'First description',
                keywords: ['keyword1', 'Keyword2'],
                href: '',
            },
            {
                key: 'bar',
                description: 'Second description',
                keywords: ['keyword3', 'Keyword2'],
                href: '',
            },
        ])
    })
})
