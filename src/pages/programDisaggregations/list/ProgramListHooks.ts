import { useDataEngine } from '@dhis2/app-runtime'
import {
    useMutation,
    useQuery,
    type UseQueryResult,
} from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useBoundQueryFn } from '../../../lib'
import { Program } from '../../../types/generated'

export type ProgramWithCategoryMappingsSize = {
    displayName: string
    name: string
    id: string
    categoryMappings: number
    programIndicators: { aggregateExportDataElement?: string }[]
}

interface ProgramsDetailedResponse {
    programs: {
        programs: ProgramWithCategoryMappingsSize[]
    }
}

const PROGRAMS_DETAILED_QUERY = {
    programs: {
        resource: 'programs',
        params: {
            fields: [
                'name',
                'displayName',
                'id',
                'categoryMappings~size',
                'programIndicators[aggregateExportDataElement]',
            ],
            paging: false,
        },
    },
}

export const useProgramsWithMappingsList =
    (): UseQueryResult<ProgramsDetailedResponse> => {
        const queryFn = useBoundQueryFn()

        return useQuery({
            queryKey: [PROGRAMS_DETAILED_QUERY],
            queryFn: queryFn<ProgramsDetailedResponse>,
        })
    }

export const useClearMappingsMutation = () => {
    const engine = useDataEngine()

    return useMutation({
        mutationFn: async (programId: string) => {
            await engine.mutate({
                type: 'json-patch',
                resource: 'programs',
                id: programId,
                partial: true,
                data: [
                    {
                        op: 'replace',
                        path: '/categoryMappings',
                        value: [],
                    },
                ],
            })
        },
    })
}

export const getProgramsWithMappings = (programs: Program[] = []) =>
    programs.filter((p) => p.categoryMappings?.length > 0)

export const transformProgramsForSelect = (results: Program[]) =>
    results.map((result) =>
        result.categoryMappings?.length > 0
            ? { ...result, disabled: true }
            : result
    )

export const useProgramDeleteModal = () => {
    const [programToDelete, setProgramToDelete] =
        useState<ProgramWithCategoryMappingsSize | null>(null)

    const open = useCallback((program: ProgramWithCategoryMappingsSize) => {
        setProgramToDelete(program)
    }, [])

    const close = useCallback(() => {
        setProgramToDelete(null)
    }, [])

    return {
        programToDelete,
        open,
        close,
        isOpen: programToDelete !== null,
    }
}
