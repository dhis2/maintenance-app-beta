import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { Content } from '../components/Content'
import { GridContainer } from '../components/GridContainer'
import { GridContent } from '../components/GridContent'
import { GridSidebar } from '../components/GridSidebar'
import { Sidebar } from '../components/Sidebar'
import { sectionOrder } from '../constants/sectionOrder'
import { createPageComponent } from './createPageComponent'

export const Overview = createPageComponent(({ name, match }) => {
    const { group } = match.params
    const sections = sectionOrder[group] || []

    return (
        <GridContainer layout="contentWithSidebar">
            <GridSidebar>
                <Sidebar sections={sections} />
            </GridSidebar>

            <GridContent>
                <Content>
                    <CardMenu sections={sections} />
                </Content>
            </GridContent>
        </GridContainer>
    )
})
