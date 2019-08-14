import propTypes from 'prop-types'

export const sectionPropType = propTypes.shape({
    name: propTypes.string.isRequired,
    path: propTypes.string.isRequired,

    schemaName: propTypes.string,
    permissions: propTypes.arrayOf(propTypes.arrayOf(propTypes.string)),
})
