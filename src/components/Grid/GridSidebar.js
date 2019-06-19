import React from 'react';
import propTypes from 'prop-types';

export const GridSidebar = ({ children }) => (
    <section>
        {children}
    </section>
)

GridSidebar.propTypes = {
    children: propTypes.element.isRequired,
}
