import { Button } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { routePaths, useLocationSearchState } from '../../lib'

export const Component = () => {
    const locationState = useLocationSearchState()
    return (
        <div>
            <Link to={routePaths.sectionNew} state={locationState}>
                <Button small>
                    Add new program indicator disaggregation mapping
                </Button>
                <div>
                    Placeholder for program indicator disaggregations (list)
                </div>
            </Link>
        </div>
    )
}
