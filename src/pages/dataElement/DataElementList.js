import React from 'react'

import { Container } from '../../components/layout/Container'
import { Content as ContentLayout } from '../../components/layout/Content'
import { SideBar as SideBarLayout } from '../../components/layout/SideBar'

import { Content } from '../../components/Content'
import { PageHeadline } from '../../components/PageHeadline'
import { Sidebar } from '../../components/Sidebar'
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
