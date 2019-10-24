import React from 'react'

import { Container } from '../modules/layout/Container'
import { Content as ContentLayout } from '../modules/layout/Content'
import { SideBar as SideBarLayout } from '../modules/layout/SideBar'
import { Content } from '../modules/Content'
import { Sidebar } from '../modules/Sidebar'
import { CardMenu } from '../modules/CardMenu/CardMenu'
import { sectionOrder } from '../constants/sectionOrder'

export const Overview = ({ name, match }) => {
    const { group } = match.params
    const sections = sectionOrder[group] || []

    return (
        <Container>
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
}
