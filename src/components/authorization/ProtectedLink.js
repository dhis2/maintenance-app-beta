import { Link } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { hasUserAuthorityForSection } from '../../utils/authority/hasUserAuthorityForSection'
import { queries } from '../../constants/queries'

export const ProtectedLink = ({ permissions, ...rest }) => {
    const { loading, error, data = {} } = useDataQuery({
        authorities: queries.authorities,
        systemSettings: queries.systemSettings,
    })

    const hasAuthorityToViewSection =
        !loading && !error
            ? hasUserAuthorityForSection(
                  data.authorities,
                  data.systemSettings,
                  permissions
              )
            : false

    return hasAuthorityToViewSection ? <Link {...rest} /> : null
}

ProtectedLink.propTypes = {
    ...Link.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
}
