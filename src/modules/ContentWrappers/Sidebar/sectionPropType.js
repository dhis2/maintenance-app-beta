import propTypes from '@dhis2/prop-types'

export const permissionPropType = propTypes.arrayOf(
    propTypes.arrayOf(propTypes.string)
)

export const sectionPropType = propTypes.shape({
    description: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    path: propTypes.string.isRequired,
    hideInCardMenu: propTypes.bool,
    hideInSideBar: propTypes.bool,
    permissions: permissionPropType,
    schemaName: propTypes.string,
})
