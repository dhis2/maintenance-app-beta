import { MenuList } from '@dhis2/ui-core'
import { connect } from 'react-redux'
import { pipe } from 'lodash/fp'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import React from 'react'
import propTypes from 'prop-types'

import { FolderClosed } from '../icons/FolderClosed'
import { sectionPropType } from './Sidebar/sectionPropType'
import { SidebarMenuItem } from './Sidebar/SidebarMenuItem'
import styles from './Sidebar.module.css'

const SidebarComponent = ({ sections, location, push }) => {
    const filteredSections = sections.filter(
        section => section.hideInSideBar !== true
    )

    return (
        <div className={styles.container}>
            <MenuList>
                {filteredSections.map(
                    ({ name, path, permissions, schemaName }) => (
                        <SidebarMenuItem
                            key={name}
                            permissions={permissions}
                            schemaName={schemaName}
                            icon={<FolderClosed />}
                            label={name}
                            active={path === location.pathname}
                            onClick={push(path)}
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
