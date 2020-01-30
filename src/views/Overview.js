import { useSelector } from 'react-redux'

import cx from 'classnames'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import propTypes from '@dhis2/prop-types'

import {
    CardMenu,
    Container,
    Content as ContentLayout,
    MainContent,
    SideBar as SideBarLayout,
    Sidebar,
} from '../modules'
import { Error } from './Error'
import { createTestNames } from '../utils/dataTest/createTestNames'
import { formatNameSegment } from '../utils/dataTest/formatNameSegment'
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

    const filteredSections = sectionOrder[group].filter(section =>
        hasUserAuthorityForSection({
            systemSettings,
            userAuthorities,
            schemas,
            section,
        })
    )

    const sidebarSections = filteredSections.filter(
        ({ hideInSideBar }) => !hideInSideBar
    )
    const cardMenuSections = filteredSections.filter(
        ({ hideInCardMenu }) => !hideInCardMenu
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
        <Container
            dataTest={cx(
                createTestNames('page-overview'),
                createTestNames(`page-overview-${formatNameSegment(group)}`)
            )}
        >
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

Overview.propTypes = {
    match: propTypes.object.isRequired,
}
