import React from 'react'

import { Container } from '../modules/layout/Container'
import { Content as ContentLayout } from '../modules/layout/Content'
import { SideBar as SideBarLayout } from '../modules/layout/SideBar'
import { MainContent } from '../modules/ContentWrappers/MainContent'
import { Sidebar } from '../modules/ContentWrappers/Sidebar'
import { CardMenu } from '../modules/CardMenu/CardMenu'
import { sectionOrder } from '../config/sectionOrder'

export const Overview = ({ name, match }) => {
    const { group } = match.params
    const sections = sectionOrder[group] || []

    return (
        <Container>
            <SideBarLayout>
                <Sidebar sections={sections} />
            </SideBarLayout>

            <ContentLayout>
                <MainContent>
                    <CardMenu sections={sections} />
                </MainContent>
            </ContentLayout>
        </Container>
    )
}
