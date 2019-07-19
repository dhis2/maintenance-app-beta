import { pipe } from 'lodash/fp'
import { connect } from 'react-redux'
import { MenuList, MenuItem } from '@dhis2/ui-core'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import React from 'react'
import propTypes from 'prop-types'

import { FolderClosed } from './icons/FolderClosed'
import { sectionPropType } from './authorization/sectionPropType'
import styles from './Sidebar.module.css'

const SidebarComponent = ({ sections, location, push }) => {
    const filteredSections = sections.filter(item => {
        if (!Array.isArray(item)) return true

        const [section, config = {}] = item
        return config.hideInSideBar !== true
    })

    const formattedSections = filteredSections.map(item =>
        !Array.isArray(item) ? item : item[0]
    )

    return (
        <div className={styles.container}>
            <MenuList>
                {formattedSections.map(
                    ({ name, path, permissions, schemaName }) => (
                        <MenuItem
                            key={name}
                            icon={<FolderClosed />}
                            label={name}
                            active={path === location.pathname}
                            onClick={
                                console.log('push path:', path) || push(path)
                            }
                        />
                    )
                )}
            </MenuList>
        </div>
    )
}

SidebarComponent.propTypes = {
    sections: propTypes.arrayOf(sectionPropType),
}

const mapDispatchToProps = dispatch => ({
    push: path => () => dispatch(push(path)),
})

const Sidebar = pipe(
    withRouter,
    connect(
        undefined,
        mapDispatchToProps
    )
)(SidebarComponent)

export { Sidebar }
