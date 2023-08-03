import { renderHook } from '@testing-library/react-hooks'
import { SECTIONS_MAP } from '../../constants'
import { useSystemSetting } from '../systemSettings'
import { useCurrentUserAuthorities } from '../user'
import { SchemaName } from './../../types/schemaBase'
import {
    useCanCreateModelInSection,
    useIsSectionAuthorizedPredicate,
} from './sectionAuthorities'

const mockedSchemas = {
    [SchemaName.dataElement]: {
        singular: 'dataElement',
        plural: 'dataElements',
        name: 'dataElement',
        displayName: 'Data Element',
        collectionName: 'dataElements',
        authorities: [
            {
                type: 'CREATE_PUBLIC',
                authorities: ['F_DATAELEMENT_PUBLIC_ADD'],
            },
            {
                type: 'CREATE_PRIVATE',
                authorities: ['F_DATAELEMENT_PRIVATE_ADD'],
            },
            {
                type: 'DELETE',
                authorities: ['F_DATAELEMENT_DELETE'],
            },
        ],
    },
    [SchemaName.category]: {
        singular: 'category',
        plural: 'categories',
        name: 'category',
        displayName: 'Category',
        collectionName: 'categories',
        authorities: [
            {
                type: 'CREATE_PUBLIC',
                authorities: ['F_CATEGORY_PUBLIC_ADD'],
            },
            {
                type: 'CREATE_PRIVATE',
                authorities: ['F_CATEGORY_PRIVATE_ADD'],
            },
            {
                type: 'DELETE',
                authorities: ['F_CATEGORY_DELETE'],
            },
        ],
    },
    [SchemaName.categoryOptionCombo]: {
        singular: 'categoryOptionCombo',
        plural: 'categoryOptionCombos',
        name: 'categoryOptionCombo',
        displayName: 'Category option combo',
        collectionName: 'categoryOptionCombos',
        authorities: [
            {
                type: 'CREATE_PUBLIC',
                authorities: ['F_CATEGORY_COMBO_PUBLIC_ADD'],
            },
            {
                type: 'CREATE_PRIVATE',
                authorities: ['F_CATEGORY_COMBO_PRIVATE_ADD'],
            },
            {
                type: 'DELETE',
                authorities: ['F_CATEGORY_COMBO_DELETE'],
            },
        ],
    },
}

jest.mock('../systemSettings', () => {
    const originalModule = jest.requireActual('../systemSettings')
    return {
        ...originalModule,
        useSystemSetting: jest.fn(),
    }
})
jest.mock('../schemas', () => {
    const originalModule = jest.requireActual('../schemas')
    return {
        ...originalModule,
        useSchemas: jest.fn(() => mockedSchemas),
    }
})

jest.mock('../user', () => {
    const originalModule = jest.requireActual('../user')
    return {
        ...originalModule,
        useCurrentUserAuthorities: jest.fn(),
    }
})

const mockedUseCurrentUserAuthorities = jest.mocked(useCurrentUserAuthorities)
const mockedUseSystemSetting = jest.mocked(useSystemSetting)

describe('sectionAuthorities', () => {
    beforeEach(() => {
        mockedUseCurrentUserAuthorities.mockReset()
        mockedUseSystemSetting.mockReset()
        mockedUseCurrentUserAuthorities.mockImplementation(
            () => new Set(['F_DATAELEMENT_PUBLIC_ADD'])
        )
        mockedUseSystemSetting.mockImplementation(() => true)
    })
    describe('useIsSectionAuthorizedPredicate', () => {
        it('should return a predicate function', () => {
            const { result } = renderHook(() =>
                useIsSectionAuthorizedPredicate()
            )
            expect(result.current).toBeInstanceOf(Function)
        })

        it('predicate function should return true when user has required authorites', async () => {
            const { result } = renderHook(() =>
                useIsSectionAuthorizedPredicate()
            )
            const isSectionAuthorized = result.current

            const isAllowed = isSectionAuthorized(SECTIONS_MAP.dataElement)
            expect(isAllowed).toBe(true)
        })
        it('predicate function should return false when user does not have required authorites', async () => {
            mockedUseCurrentUserAuthorities.mockImplementation(
                () => new Set(['F_DATAELEMENT_DELETE'])
            )
            const { result } = renderHook(() =>
                useIsSectionAuthorizedPredicate()
            )
            const isSectionAuthorized = result.current

            const isAllowed = isSectionAuthorized(SECTIONS_MAP.dataElement)
            expect(isAllowed).toBe(false)
        })
        it('predicate function should return true if systemSetting keyRequireAddToView is false, even without required auth', async () => {
            mockedUseSystemSetting.mockImplementation(() => false)
            const { result } = renderHook(() =>
                useIsSectionAuthorizedPredicate()
            )
            const isSectionAuthorized = result.current

            const isAllowed = isSectionAuthorized(SECTIONS_MAP.dataElement)
            expect(isAllowed).toBe(true)
        })
    })
    describe('useCanCreateModelInSection', () => {
        it('should return true if user has required authorities', () => {
            const { result } = renderHook(() =>
                useCanCreateModelInSection(SECTIONS_MAP.dataElement)
            )
            const isSectionAuthorized = result.current

            expect(isSectionAuthorized).toBe(true)
        })
        it('should return false if user does not have required authorities', () => {
            const { result } = renderHook(() =>
                useCanCreateModelInSection(SECTIONS_MAP.category)
            )
            const isSectionAuthorized = result.current

            expect(isSectionAuthorized).toBe(false)
        })
        it('should return false if section is categoryOptionCombo, even with required auth', () => {
            mockedUseCurrentUserAuthorities.mockImplementation(
                () =>
                    new Set([
                        'F_CATEGORY_COMBO_PUBLIC_ADD',
                        'F_CATEGORY_COMB_PRIVATE_ADD',
                    ])
            )
            const { result } = renderHook(() =>
                useCanCreateModelInSection(SECTIONS_MAP.categoryOptionCombo)
            )
            const isSectionAuthorized = result.current
            expect(isSectionAuthorized).toBe(false)
        })
        it('should return false if user does not have required authorities, even if keyRequiredAddToView is false', () => {
            const { result } = renderHook(() =>
                useCanCreateModelInSection(SECTIONS_MAP.category)
            )
            const isSectionAuthorized = result.current

            expect(isSectionAuthorized).toBe(false)
        })
    })
})
