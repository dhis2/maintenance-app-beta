import React from 'react'

import { CardMenu } from '../components/CardMenu'
import { Content } from '../components/Content'
import { GridContainer } from '../components/Grid/GridContainer'
import { GridContent } from '../components/Grid/GridContent'
import { GridSidebar } from '../components/Grid/GridSidebar'
import { Sidebar } from '../components/Sidebar'
import { sectionsOrder } from '../constants/group_and_sections_order'

export const Overview = ({ name, match }) => {
    const { group } = match.params
    const sections = sectionsOrder[group] || []

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
}
