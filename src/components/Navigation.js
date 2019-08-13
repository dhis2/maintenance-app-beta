import { ScrollBar, TabBar } from '@dhis2/ui-core'
import { connect } from 'react-redux'
import React from 'react'

import cx from 'classnames'

import { NavigationLink } from './Navigation/NavigationLink'
import { groupOrder } from '../constants/groupOrder'

const NavigationComponent = ({ disabled }) => {
    return (
        <nav className={cx({ disabled })}>
            <ScrollBar>
                <TabBar fixed>
                    <NavigationLink
                        to="/list/all"
                        disabled={disabled}
                        group="all"
                        label={'All'}
                    />

                    {groupOrder.map(({ name, path, key }) => (
                        <NavigationLink
                            key={key}
                            to={`/list/${key}Section`}
                            group={key}
                            label={name}
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
