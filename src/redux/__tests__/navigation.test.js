import {
    navigationDefaultState as defaultState,
    disableNavigation,
    enableNavigation,
    getNavigation,
    getNavigationDisabled,
    navigation as reducer,
} from '../navigation'

describe('Reducer', () => {
    it('should return the current state if an unknown action has been dispatched', () => {
        const state = { ...defaultState }
        const action = { type: 'UNKNOWN_ACTION' }
        const expected = defaultState
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the disabled state to true when disable action has been dispatched', () => {
        const state = { ...defaultState, disabled: false }
        const action = disableNavigation()
        const expected = { ...state, disabled: true }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })

    it('should set the disabled state to false when enable action has been dispatched', () => {
        const state = { ...defaultState, disabled: true }
        const action = enableNavigation()
        const expected = { ...state, disabled: false }
        const actual = reducer(state, action)

        expect(actual).toEqual(expected)
    })
})

describe('Selector', () => {
    const state = { navigation: defaultState }

    it('should return the navigation', () => {
        expect(getNavigation(state)).toEqual(defaultState)
    })

    it('should return the disabled state', () => {
        expect(getNavigationDisabled(state)).toBe(defaultState.disabled)
    })
})
