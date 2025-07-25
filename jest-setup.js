import { configure } from '@testing-library/react'
import '@testing-library/jest-dom'

// Not defined on nodejs
window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

beforeEach(() => {
    configure({ testIdAttribute: 'data-test' })
    global.IntersectionObserver = class {
        constructor(callback, options) {
            this.callback = callback
            this.options = options
        }

        observe = jest.fn()
        unobserve = jest.fn()
        disconnect = jest.fn()
    }

    global.ResizeObserver = class {
        observe = jest.fn()
        unobserve = jest.fn()
        disconnect = jest.fn()
    }
})

jest.setTimeout(20000)
