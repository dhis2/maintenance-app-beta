import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { GridContainer } from '../components/GridContainer'
import { GridContent } from '../components/GridContent'
import { createPageComponent } from './createPageComponent'
import { groupOrder } from '../constants/groupOrder'
import { sectionOrder } from '../constants/sectionOrder'

export const All = createPageComponent(() => (
    <GridContainer layout="contentOnly">
        <GridContent>
            {groupOrder.map(group => (
                <section key={group.name}>
                    <h2>{group.name}</h2>
                    <CardMenu sections={sectionOrder[group.key]} />
                </section>
            ))}
        </GridContent>
    </GridContainer>
))
