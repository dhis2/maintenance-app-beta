import { mount } from 'enzyme'
import React from 'react'

import { Navigation } from '../Navigation'
import { NavigationLink } from '../NavigationLink'
import { groupOrder } from '../../../config'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(() => false),
}))

jest.mock('../NavigationLink', () => ({
    NavigationLink: function NavigationLink() {
        return <span />
    },
}))

jest.mock('../GroupEditorLink', () => ({
    GroupEditorLink: function GroupEditorLink() {
        return <span />
    },
}))

// @TODO remove once TabBar children propTypes accepts nested
// arrayrs.
const originalError = console.error
jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (!args[0].includes('Invalid prop `children` supplied to `TabBar`')) {
        originalError(...args)
    }
})

describe('Navigation', () => {
    it('should render a navigation link for each greap', () => {
        // "All"
        const staticLinkAmount = 1
        const expectedLinkLength = groupOrder.length + staticLinkAmount
        const navigation = mount(<Navigation />)
        const navigationLinks = navigation.find(NavigationLink)
        expect(navigationLinks).toHaveLength(expectedLinkLength)
    })
})
