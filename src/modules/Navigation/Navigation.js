import { ScrollBar, TabBar } from '@dhis2/ui-core'
import { connect } from 'react-redux'
import React from 'react'

import cx from 'classnames'

import { NavigationLink } from './NavigationLink'
import { groupOrder } from '../../config'

const NavigationComponent = ({ disabled }) => {
    return (
        <nav className={cx({ disabled })}>
            <ScrollBar>
                <TabBar fixed>
                    <NavigationLink
                        noAuth
                        id="all"
                        to="/list/all"
                        label={'All'}
                        disabled={disabled}
                    />

                    {groupOrder.map(group => (
                        <NavigationLink
                            key={group.key}
                            id={group.key}
                            to={`/list/${group.key}Section`}
                            group={group}
                            label={group.name}
                            disabled={disabled}
                        />
                    ))}
                </TabBar>
            </ScrollBar>
        </nav>
    )
}

const mapStateToProps = ({ navigation }) => ({
    disabled: navigation.disabled,
})

const Navigation = connect(mapStateToProps)(NavigationComponent)

export { Navigation }
