import React from 'react'

import {
    Container,
    Content as ContentLayout,
    SideBar as SideBarLayout,
    MainContent,
    Sidebar,
    PageHeadline,
} from '../../modules'
import { createTestNames } from '../../utils/dataTest/createTestNames'
import { dataElementSections, groups, sectionOrder } from '../../config'

export const DataElementList = () => (
    <Container dataTest={createTestNames('page-dataelementlist')}>
        <SideBarLayout>
            <Sidebar sections={sectionOrder[groups.dataElement.key]} />
        </SideBarLayout>

        <ContentLayout>
            <MainContent>
                <PageHeadline>
                    {dataElementSections.dataElement.name}
                </PageHeadline>
                <span>Data elements list...</span>
            </MainContent>
        </ContentLayout>
    </Container>
)
