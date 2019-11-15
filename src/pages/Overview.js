import { useSelector } from 'react-redux'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { CardMenu } from '../modules/CardMenu/CardMenu'
import { Container } from '../modules/layout/Container'
import { Content as ContentLayout } from '../modules/layout/Content'
import { Error } from './Error'
import { MainContent } from '../modules/ContentWrappers/MainContent'
import { SideBar as SideBarLayout } from '../modules/layout/SideBar'
import { Sidebar } from '../modules/ContentWrappers/Sidebar'
import { getSchemasData } from '../redux/schemas'
import { getSystemSettingsData } from '../redux/systemSettings'
import { getUserAuthoritiesData } from '../redux/userAuthority'
import { groups } from '../config/groups'
import { hasUserAuthorityForSection } from '../utils/authority/hasUserAuthorityForSection'
import { sectionOrder } from '../config/sectionOrder'

export const Overview = ({ match }) => {
    const { group } = match.params
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)

    if (!groups[group])
        return (
            <Error
                error={i18n.t(
                    "The group you're trying to access does not exist"
                )}
            />
        )

    const sections = sectionOrder[group].filter(section =>
        hasUserAuthorityForSection({
            systemSettings,
            authorities: userAuthorities,
            schema: schemas[section.schemaName],
            permissions: section.permissions,
        })
    )

    if (!sections.length)
        return (
            <Error
                error={i18n.t(
                    "You don't have the permissions to view this page"
                )}
            />
        )

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
