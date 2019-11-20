import { useSelector } from 'react-redux'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import {
    CardMenu,
    Container,
    Content as ContentLayout,
    MainContent,
    SideBar as SideBarLayout,
    Sidebar,
} from '../modules'
import { Error } from './Error'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../redux'
import { groups, sectionOrder } from '../config'
import { hasUserAuthorityForSection } from '../utils'

export const Overview = ({ match }) => {
    const { group } = match.params
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)

    if (!groups[group]) {
        return (
            <Error
                error={i18n.t(
                    "The group you're trying to access does not exist"
                )}
            />
        )
    }

    const sidebarSections = sectionOrder[group]
        .filter(({ hideInSideBar }) => !hideInSideBar)
        .filter(section =>
            hasUserAuthorityForSection({
                systemSettings,
                authorities: userAuthorities,
                schema: schemas[section.schemaName],
                permissions: section.permissions,
            })
        )
    const cardMenuSections = sectionOrder[group]
        .filter(({ hideInCardMenu }) => !hideInCardMenu)
        .filter(section =>
            hasUserAuthorityForSection({
                systemSettings,
                authorities: userAuthorities,
                schema: schemas[section.schemaName],
                permissions: section.permissions,
            })
        )

    if (!sidebarSections.length && !cardMenuSections.length) {
        return (
            <Error
                error={i18n.t(
                    "You don't have the permissions to view this page"
                )}
            />
        )
    }

    return (
        <Container>
            <SideBarLayout>
                <Sidebar sections={sidebarSections} />
            </SideBarLayout>

            <ContentLayout>
                <MainContent>
                    <CardMenu sections={cardMenuSections} />
                </MainContent>
            </ContentLayout>
        </Container>
    )
}
