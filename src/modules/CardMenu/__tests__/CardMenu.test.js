import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'

import { CardMenu } from '../CardMenu'
import { MenuCard } from '../../MenuCard/MenuCard'

describe('CardMenu', () => {
    const sections = [
        {
            name: 'Foo option',
            path: 'list/fooSection/fooOption',
            description: 'Create, modify & view foo options',
        },
        {
            name: 'Bar option',
            path: 'list/barSection/barOption',
            description: 'Create, modify & view bar options',
        },
    ]

    it('should render a MenuCard for each route', () => {
        const menu = mount(
            <MemoryRouter>
                <CardMenu sections={sections} />
            </MemoryRouter>
        )
        const menuCards = menu.find(MenuCard)

        expect(menuCards).toHaveLength(sections.length)
    })
})
