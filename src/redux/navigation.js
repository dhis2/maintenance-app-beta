import { isEqual } from 'lodash/fp'

/**
 * Actions types
 * =============
 */

export const NAVIGATION_DISABLE = 'NAVIGATION_DISABLE'
export const NAVIGATION_ENABLE = 'NAVIGATION_ENABLE'

/**
 * Action creators
 * ===============
 */

export const disableNavigation = () => ({
    type: NAVIGATION_DISABLE,
})

export const enableNavigation = () => ({
    type: NAVIGATION_ENABLE,
})

/**
 * Reducer
 * =======
 */

export const navigation = (
    state = { disabled: false },
    { type, payload } = {}
) => {
    const isType = isEqual(type)

    if (isType(NAVIGATION_DISABLE)) {
        return { ...state, disabled: true }
    }

    if (isType(NAVIGATION_ENABLE)) {
        return { ...state, disabled: false }
    }

    return state
}
