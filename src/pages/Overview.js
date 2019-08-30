import React from 'react'

import { Container } from '../components/layout/Container'
import { Content as ContentLayout } from '../components/layout/Content'
import { SideBar as SideBarLayout } from '../components/layout/SideBar'
import { Content } from '../components/Content'
import { Sidebar } from '../components/Sidebar'
import { CardMenu } from '../components/CardMenu'
import { sectionOrder } from '../constants/sectionOrder'
import { createPageComponent } from './createPageComponent'

export const Overview = createPageComponent(({ name, match }) => {
    const { group } = match.params
    const sections = sectionOrder[group] || []

    return (
        <Container layout="contentWithSidebar">
            <SideBarLayout>
                <Sidebar sections={sections} />
            </SideBarLayout>

            <ContentLayout>
                <Content>
                    <CardMenu sections={sections} />
                </Content>
            </ContentLayout>
        </Container>
    )
})
