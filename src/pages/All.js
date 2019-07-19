import { GridContent } from '../components/Grid/GridContent'

import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { GridContainer } from '../components/Grid/GridContainer'
import {
    groupOrder,
    sectionsOrder,
} from '../constants/group_and_sections_order'

export const All = () => (
    <GridContainer layout="contentOnly">
        <GridContent>
            {groupOrder.map(group => (
                <section key={group.name}>
                    <h2>{group.name}</h2>
                    <CardMenu sections={sectionsOrder[group.key]} />
                </section>
            ))}
        </GridContent>
    </GridContainer>
)
