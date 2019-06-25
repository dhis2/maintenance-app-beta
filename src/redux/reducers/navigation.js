import { LOCATION_CHANGE } from 'connected-react-router'
import { isEqual } from 'lodash/fp'

const defaultState = { disabled: false }

export const navigation = (state = defaultState, action = {}) => {
    const { type, payload } = action
    const isType = isEqual(type)

    if (isType(LOCATION_CHANGE)) {
        const { location } = payload

        if (location.pathname.match(/^\/edit/)) {
            return { ...state, disabled: true }
        }
    }

    return state
}
