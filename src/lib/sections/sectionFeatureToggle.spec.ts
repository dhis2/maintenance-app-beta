import { useConfig } from '@dhis2/app-runtime'
import { renderHook } from '@testing-library/react'
import { useIsSectionFeatureToggle } from './sectionFeatureToggle'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(),
}))

const mockedUseConfig = jest.mocked(useConfig)

describe('useIsSectionFeatureToggle', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it.each([
        [42, 44, true],
        [44, undefined, false],
        [undefined, 42, false],
        [40, undefined, true],
        [undefined, 46, true],
        [40, 41, false],
        [undefined, undefined, true],
        [43, undefined, true],
        [undefined, 43, true],
        [43, 43, true],
    ])(
        'with minApiVersion of %i and maxApiVersion of %i it will return %b',
        (minApiVersion, maxApiVersion, expected) => {
            mockedUseConfig.mockReturnValue({ apiVersion: 43, baseUrl: '' })
            const { result } = renderHook(() => useIsSectionFeatureToggle())
            const isSectionFeatureToggled = result.current
            const section = {
                name: 'testSection',
                namePlural: 'testSections',
                titlePlural: 'testSectionsTitle',
                title: 'testSectionTitle',
                componentName: 'componentName',
                minApiVersion,
                maxApiVersion,
            }
            if (!minApiVersion) {
                delete section.minApiVersion
            }
            if (!maxApiVersion) {
                delete section.maxApiVersion
            }
            const actual = isSectionFeatureToggled(section)
            expect(actual).toEqual(expected)
        }
    )
})
