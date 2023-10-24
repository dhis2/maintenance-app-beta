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
})
