import { useSelector } from 'react-redux'
import { mount } from 'enzyme'
import React from 'react'

import { GroupEditorLink } from '../GroupEditorLink'
import { NavigationLink } from '../NavigationLink'
import { getSystemSettingsData, getUserAuthoritiesData } from '../../../redux'
import { groupEditorSection } from '../../../config'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}))

jest.mock('../NavigationLink', () => ({
    NavigationLink: function NavigationLink() {
        return <span />
    },
}))

describe('GroupEditorLink', () => {
    it('should return null when the user does not have the required permissions', () => {
        useSelector.mockImplementation(selector => {
            if (selector === getSystemSettingsData) {
                return { keyRequireAddToView: true }
            }

            if (selector === getUserAuthoritiesData) {
                return []
            }
        })

        const groupEditorLink = mount(<GroupEditorLink />)
        const navigationLink = groupEditorLink.find(NavigationLink)

        expect(navigationLink).toHaveLength(0)
    })

    it('should return null when the user does not have the required permissions', () => {
        useSelector.mockImplementation(selector => {
            if (selector === getSystemSettingsData) {
                return { keyRequireAddToView: true }
            }

            if (selector === getUserAuthoritiesData) {
                // give user one of the required permissions
                return groupEditorSection.permissions[0]
            }
        })

        const groupEditorLink = mount(<GroupEditorLink />)
        const navigationLink = groupEditorLink.find(NavigationLink)

        expect(navigationLink).toHaveLength(1)
    })
})
