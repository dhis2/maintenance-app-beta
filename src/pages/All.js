import React from 'react'

import { CardMenu } from '../modules/CardMenu/CardMenu'
import { Container } from '../modules/layout/Container'
import { Content } from '../modules/layout/Content'
import { groupOrder } from '../config/groupOrder'
import { sectionOrder } from '../config/sectionOrder'

export const All = () => (
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
)
