
// create layout component with sidebar and content
import classnames from 'classnames'
import { node, bool } from 'prop-types'
import React from 'react'
import css from './layout.module.css'

export const Layout = ({ main, sidebar }) => {

    return (
            <div className={css.wrapper}>
            <aside className={css.sidebar}>{sidebar}</aside>
                <div
                    className={css.main}
                >
                    {main}
                </div>
            </div>
    );
}

Layout.propTypes = {
    header: node,
    main: node,
    sidebar: node,
}

export default Layout
