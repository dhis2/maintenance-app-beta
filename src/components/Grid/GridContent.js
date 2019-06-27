import React from 'react'
import propTypes from 'prop-types'

export const GridContent = ({ children }) => <section>{children}</section>

GridContent.propTypes = {
    children: propTypes.oneOfType([
        propTypes.element,
        propTypes.arrayOf(propTypes.element),
    ]).isRequired,
}
