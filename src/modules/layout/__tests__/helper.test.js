import React from 'react'

import { mount } from 'enzyme'

import { SideBar } from '../SideBar'
import { TopBar } from '../TopBar'
import { determineClassName } from '../helper'

/**
 * I didn't find another proper way to create react
 * children without manually creating the key/value pairs.
 * This way we won't have to adjust the children's api if it changes
 */
const createChildren = children => {
    return mount(<div>{children}</div>).props().children
}

describe('determineClassName', () => {
    it('should return a className with the withTopBar className only', () => {
        const children = createChildren([<TopBar key="1" />])
        const className = determineClassName(children)
        const classNames = className.split(' ')
        const expected = ['container', 'withTopBar']

        expect(classNames).toEqual(expected)
    })

    it('should return a className with the withSidebar className only', () => {
        const children = createChildren([<SideBar key="1" />])
        const className = determineClassName(children)
        const classNames = className.split(' ')
        const expected = ['container', 'withSidebar']

        expect(classNames).toEqual(expected)
    })

    it('should return a className with the withSidebar and withTopBar classNames', () => {
        const children = createChildren([
            <SideBar key="1" />,
            <TopBar key="2" />,
        ])
        const className = determineClassName(children)
        const classNames = className.split(' ')
        const expected = ['container', 'withSidebar', 'withTopBar']

        expect(classNames).toEqual(expected)
    })
})
