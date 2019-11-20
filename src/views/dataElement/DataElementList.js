import React from 'react'

import { Container } from '../../modules/layout/Container'
import { Content as ContentLayout } from '../../modules/layout/Content'
import { SideBar as SideBarLayout } from '../../modules/layout/SideBar'

import { MainContent } from '../../modules/ContentWrappers/MainContent'
import { Sidebar } from '../../modules/ContentWrappers/Sidebar'
import { PageHeadline } from '../../modules/PageHeadline/PageHeadline'
import { dataElementSections } from '../../config/sections'
import { groups } from '../../config/groups'
import { sectionOrder } from '../../config/sectionOrder'

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
