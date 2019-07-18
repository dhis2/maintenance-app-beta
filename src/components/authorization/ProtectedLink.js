import { Link } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import React from 'react'
import propTypes from 'prop-types'

import { hasUserAuthorityForSection } from '../../utils/authority/hasUserAuthorityForSection'
import { queries } from '../../constants/queries'
import styles from './ProtectedLink.module.css'

export const ProtectedLink = ({ permissions, schemaName, ...rest }) => {
    const query = {
        authorities: queries.authorities,
        systemSettings: queries.systemSettings,
    }

    if (schemaName) {
        query.schema = { resource: `schemas/${schemaName}.json` }
    }

    const { loading, error, data = {} } = useDataQuery(query)

    const hasAuthorityToViewSection =
        !loading && !error
            ? hasUserAuthorityForSection({
                  authorities: data.authorities,
                  systemSettings: data.systemSettings,
                  schema: data.schema,
                  permissions,
              })
            : false

    return hasAuthorityToViewSection ? (
        <Link className={styles.link} {...rest} />
    ) : null
}

ProtectedLink.propTypes = {
    ...Link.propTypes,
    permissions: propTypes.arrayOf(propTypes.string),
    schemaName: propTypes.string,
}

ProtectedLink.defaultProps = {
    schemaName: '',
}
