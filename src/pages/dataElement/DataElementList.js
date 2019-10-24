import React from 'react'

import { Container } from '../../modules/layout/Container'
import { Content as ContentLayout } from '../../modules/layout/Content'
import { SideBar as SideBarLayout } from '../../modules/layout/SideBar'

import { MainContent } from '../../modules/ContentWrappers/MainContent'
import { Sidebar } from '../../modules/ContentWrappers/Sidebar'
import { PageHeadline } from '../../modules/PageHeadline/PageHeadline'
import { dataElementSections } from '../../constants/sections'
import { groups } from '../../constants/groups'
import { sectionOrder } from '../../constants/sectionOrder'

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
