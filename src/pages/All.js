import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { Container } from '../components/layout/Container'
import { Content } from '../components/layout/Content'
import { createPageComponent } from './createPageComponent'
import { groupOrder } from '../constants/groupOrder'
import { sectionOrder } from '../constants/sectionOrder'

export const All = createPageComponent(() => (
    <Container>
        <Content>
            {groupOrder.map(group => (
                <section key={group.name}>
                    <h2>{group.name}</h2>
                    <CardMenu sections={sectionOrder[group.key]} />
                </section>
            ))}
        </Content>
    </Container>
))
