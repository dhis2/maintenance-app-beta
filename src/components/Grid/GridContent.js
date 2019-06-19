import React from 'react';
import propTypes from 'prop-types';

export const GridContent = ({ children }) => (
    <section>
        {children}
    </section>
)

GridContent.propTypes = {
    children: propTypes.element.isRequired,
}
