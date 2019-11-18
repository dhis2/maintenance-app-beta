import { useSelector } from 'react-redux'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { CardMenu } from '../modules/CardMenu/CardMenu'
import { Container } from '../modules/layout/Container'
import { Content } from '../modules/layout/Content'
import { Error } from './Error'
import { getSchemasData } from '../redux/schemas'
import { getSystemSettingsData } from '../redux/systemSettings'
import { getUserAuthoritiesData } from '../redux/userAuthority'
import { groupOrder } from '../config/groupOrder'
import { hasUserAuthorityForGroup } from '../utils/authority/hasUserAuthorityForGroup'
import { hasUserAuthorityForSection } from '../utils/authority/hasUserAuthorityForSection'
import { sectionOrder } from '../config/sectionOrder'

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
        <Container>
            <Content>
                {authorizedGroupOrder.map(group => {
                    const sections = sectionOrder[group.key].filter(section =>
                        hasUserAuthorityForSection({
                            systemSettings,
                            authorities: userAuthorities,
                            schema: schemas[section.schemaName],
                            permissions: section.permissions,
                        })
                    )

                    return (
                        <section key={group.name}>
                            <h2>{group.name}</h2>
                            <CardMenu sections={sections} />
                        </section>
                    )
                })}
            </Content>
        </Container>
    )
}
