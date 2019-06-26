import { isEqual } from 'lodash/fp'

import { NAVIGATION_DISABLE, NAVIGATION_ENABLE } from '../actions/navigation'

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
