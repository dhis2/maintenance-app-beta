import { useSelector } from 'react-redux'

import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { CardMenu, Container, Content, MainContent } from '../modules'
import { Error } from './Error'
import { createTestNames } from '../utils/dataTest/createTestNames'
import {
    getSchemasData,
    getSystemSettingsData,
    getUserAuthoritiesData,
} from '../redux'
import { groupOrder, sectionOrder } from '../config'
import { hasUserAuthorityForGroup, hasUserAuthorityForSection } from '../utils'

export const All = () => {
    const schemas = useSelector(getSchemasData)
    const userAuthorities = useSelector(getUserAuthoritiesData)
    const systemSettings = useSelector(getSystemSettingsData)

    const authorizedGroupOrder = groupOrder.filter(group => {
        return hasUserAuthorityForGroup({
            group,
            schemas,
            userAuthorities,
            systemSettings,
        })
    })

    if (!authorizedGroupOrder.length)
        return (
            <Error
                error={i18n.t("You don't have permission to access this app")}
            />
        )

    return (
        <Container dataTest={createTestNames('page-all')}>
            <Content>
                <MainContent>
                    {authorizedGroupOrder.map(group => {
                        const sections = sectionOrder[group.key]
                            .filter(({ hideInCardMenu }) => !hideInCardMenu)
                            .filter(section => {
                                return hasUserAuthorityForSection({
                                    systemSettings,
                                    userAuthorities,
                                    schemas,
                                    section,
                                })
                            })

                        return (
                            <section key={group.name}>
                                <h2>{group.name}</h2>
                                <CardMenu sections={sections} />
                            </section>
                        )
                    })}
                </MainContent>
            </Content>
        </Container>
    )
}
