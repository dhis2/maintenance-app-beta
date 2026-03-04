import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { LegacyAppRedirect } from '../../app/routes/LegacyAppRedirect'
import { SECTIONS_MAP, useBoundResourceQueryFn } from '../../lib'
import { PickWithFieldFilters, Program } from '../../types/generated'
import { EditEventProgram } from './EditEventProgram'
import { EditTrackerProgram } from './EditTrackerProgram'

type ProgramValues = {
    id: string
    programType: 'WITHOUT_REGISTRATION' | 'WITH_REGISTRATION'
}

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const program = useQuery({
        queryFn: queryFn<ProgramValues>,
        queryKey: [
            {
                resource: 'programs',
                id: modelId,
                params: {
                    fields: ['id', 'programType'],
                },
            },
        ] as const,
    })

    if (program?.data?.programType === 'WITHOUT_REGISTRATION') {
        return <EditEventProgram />
    }

    return <EditTrackerProgram />
}
