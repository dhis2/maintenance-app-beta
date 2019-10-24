import React from 'react'

import { Container } from '../../modules/layout/Container'
import { Content as ContentLayout } from '../../modules/layout/Content'
import { SideBar as SideBarLayout } from '../../modules/layout/SideBar'

import { Content } from '../../modules/Content'
import { PageHeadline } from '../../modules/PageHeadline'
import { Sidebar } from '../../modules/Sidebar'
import { dataElementSections } from '../../constants/sections'
import { groups } from '../../constants/groups'
import { sectionOrder } from '../../constants/sectionOrder'

export const DataElementList = () => (
    <Container>
        <SideBarLayout>
            <Sidebar sections={sectionOrder[groups.dataElement.key]} />
        </SideBarLayout>

        <ContentLayout>
            <Content>
                <PageHeadline>
                    {dataElementSections.dataElement.name}
                </PageHeadline>
                <span>Data elements list...</span>
            </Content>
        </ContentLayout>
    </Container>
)
