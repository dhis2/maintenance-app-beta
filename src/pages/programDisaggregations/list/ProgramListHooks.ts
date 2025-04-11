import { useDataEngine } from '@dhis2/app-runtime'
import {
    useMutation,
    useQuery,
    type UseQueryResult,
} from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { Program } from '../../../types/generated'

export const PROGRAMS_GIST_QUERY_KEY = ['programs-gist'] as const
interface ProgramsGistResponse {
    programs: {
        programs: Program[]
    }
}

const fields = ['name', 'displayName', 'id', 'categoryMappings'] as const

export const PROGRAMS_SELECT_QUERY = {
    resource: 'programs',
    params: {
        fields: [...fields],
    },
}

export const useProgramsList = (): UseQueryResult<ProgramsGistResponse> => {
    const engine = useDataEngine()

    return useQuery(PROGRAMS_GIST_QUERY_KEY, async () => {
        const response = await engine.query({
            programs: {
                resource: 'programs/gist',
                params: {
                    fields: [...fields],
                    order: 'name:asc',
                    pageSize: 200,
                },
            },
        })
        return response
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
    const [programToDelete, setProgramToDelete] = useState<Program | null>(null)

    const open = useCallback((program: Program) => {
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
