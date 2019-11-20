import React from 'react'

import {
    Container,
    Content as ContentLayout,
    SideBar as SideBarLayout,
    MainContent,
    Sidebar,
    PageHeadline,
} from '../../modules'
import { dataElementSections, groups, sectionOrder } from '../../config'

export const DataElementList = () => (
    <Container>
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
