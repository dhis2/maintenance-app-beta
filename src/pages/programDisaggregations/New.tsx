import React from 'react'
import { useLocation } from 'react-router-dom'

export const Component = () => {
    const location = useLocation()

    // Retrieve the programId from the location state
    const { programId } = location.state || {}
    return (
        <div>
            <span>Placeholder for program disaggregations (New)</span>
            <br />
            <span>ProgramId: {programId}</span>
        </div>
    )
}
