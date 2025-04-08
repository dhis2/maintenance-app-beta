import React from 'react'
import { LinkButton } from '../../components/LinkButton'
import { useLocationSearchState } from '../../lib'

export const Component = () => {
    const preservedSearchState = useLocationSearchState()
    return (
        <LinkButton
            small
            // disabled={false}
            secondary
            to={{ pathname: 'IpHINAT79UW' }}
            state={preservedSearchState}
        >
            Edit Child programme, program disaggregation mapping
        </LinkButton>
    )
}
