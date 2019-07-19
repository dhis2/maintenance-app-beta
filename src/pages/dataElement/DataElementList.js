import React from 'react'

import { Content } from '../../components/Content'
import { GridContainer } from '../../components/Grid/GridContainer'
import { GridSidebar } from '../../components/Grid/GridSidebar'
import { GridContent } from '../../components/Grid/GridContent'
import { Sidebar } from '../../components/Sidebar'
import { PageHeadline } from '../../components/PageHeadline'
import {
    dataElementSections,
    groups,
} from '../../constants/groups_and_sections'
import { sectionsOrder } from '../../constants/group_and_sections_order'

export const DataElementList = () => (
    <GridContainer>
        <GridSidebar>
            <Sidebar sections={sectionsOrder[groups.dataElement.key]} />
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
)
