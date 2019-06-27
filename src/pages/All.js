import { GridContent } from '../components/Grid/GridContent'

import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { GridContainer } from '../components/Grid/GridContainer'
import { mainSectionOrder, subSectionOrder } from '../constants/sectionOrder'

export const All = () => (
    <GridContainer layout="contentOnly">
        <GridContent>
            {mainSectionOrder.map(mainSection => (
                <section key={mainSection.name}>
                    <h2>{mainSection.name}</h2>
                    <CardMenu sections={subSectionOrder[mainSection.key]} />
                </section>
            ))}
        </GridContent>
    </GridContainer>
)
