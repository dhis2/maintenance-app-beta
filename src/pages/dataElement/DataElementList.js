import React from 'react'

import { Content } from '../../components/Content'
import { GridContainer } from '../../components/Grid/GridContainer'
import { GridContent } from '../../components/Grid/GridContent'
import { GridSidebar } from '../../components/Grid/GridSidebar'
import { PageHeadline } from '../../components/PageHeadline'
import { Sidebar } from '../../components/Sidebar'
import { createPageComponent } from '../createPageComponent'
import { dataElementSections } from '../../constants/sections'
import { groups } from '../../constants/groups'
import { sectionOrder } from '../../constants/sectionOrder'

export const DataElementList = createPageComponent(() => (
    <GridContainer>
        <GridSidebar>
            <Sidebar sections={sectionOrder[groups.dataElement.key]} />
        </GridSidebar>

        <GridContent>
            <Content>
                <PageHeadline>
                    {dataElementSections.dataElement.name}
                </PageHeadline>
                <span>Data elements list...</span>
            </Content>
        </GridContent>
    </GridContainer>
))
