import React from 'react'
import { useLocationSearchState } from '../../lib'
import { NewEventProgram } from './NewEventProgram'
import { NewTrackerProgram } from './NewTrackerProgram'

export const Component = () => {
    const locationState = useLocationSearchState()
    const queryParams = new URLSearchParams(locationState?.search)
    const programType =
        queryParams.get('programType') ||
        ('WITHOUT_REGISTRATION' as 'WITHOUT_REGISTRATION' | 'WITH_REGISTRATION')

    return programType === 'WITH_REGISTRATION' ? (
        <NewTrackerProgram />
    ) : (
        <NewEventProgram />
    )
}
