import React from 'react'

import { subSectionOrder } from '../constants/sectionOrder'
import { GridContainer } from '../components/Grid/GridContainer'
import { GridContent } from '../components/Grid/GridContent'
import { CardMenu } from '../components/CardMenu'
import { Sidebar } from '../components/Sidebar'

export const Overview = ({ name, match }) => {
    const { section } = match.params
    const sections = subSectionOrder[section] || []

    return (
        <GridContainer>
            <Sidebar sections={sections} />

            <GridContent>
                <h1>{name}</h1>
                <CardMenu sections={sections} />
            </GridContent>
        </GridContainer>
    )
}
