import propTypes from '@dhis2/prop-types'

export const permissionPropType = propTypes.arrayOf(
    propTypes.arrayOf(propTypes.string)
)

export const sectionPropType = propTypes.shape({
    name: propTypes.string.isRequired,
    path: propTypes.string.isRequired,
    description: propTypes.string.isRequired,
    schemaName: propTypes.string,
    permissions: permissionPropType,
})
