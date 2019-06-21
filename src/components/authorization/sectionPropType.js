import propTypes from 'prop-types'

export const sectionPropType = propTypes.shape({
    name: propTypes.string.isRequired,
    path: propTypes.string.isRequired,
    permissions: propTypes.arrayOf(propTypes.string),
})
