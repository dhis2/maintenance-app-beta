import { connect } from 'react-redux'
import { ScrollBar, TabBar } from '@dhis2/ui-core'
import React from 'react'
import cx from 'classnames'

import { mainSectionOrder } from '../constants/sectionOrder'
import { NavigationLink } from './Navigation/NavigationLink'

const NavigationComponent = ({ disabled }) => {
    return (
        <nav className={cx({ disabled })}>
            <ScrollBar>
                <TabBar fixed>
                    <NavigationLink
                        to="/list/all"
                        disabled={disabled}
                        section="all"
                        label={'All'}
                    />

                    {mainSectionOrder.map(({ name, path, key }) => (
                        <NavigationLink
                            key={key}
                            to={`/list/${key}Section`}
                            section={key}
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
