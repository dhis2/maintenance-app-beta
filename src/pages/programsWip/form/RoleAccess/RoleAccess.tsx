import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SharingDialog } from '@dhis2/ui'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useMemo, useState } from 'react'
import { useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import type { SharingSettings } from '../../../../lib'
import { areSharingPropertiesSimilar } from '../../../../lib'
import type { ProgramValues } from '../../Edit'
import css from './RoleAccess.module.css'
import { RoleAccessBox } from './RoleAccessBox'

type ProgramStageWithSharing = {
    id: string
    displayName: string
    access?: {
        data?: { write: boolean; read: boolean }
        manage: boolean
        read: boolean
        write: boolean
    }
    sharing?: SharingSettings
}

type ModalState = {
    isOpen: boolean
    entityType: 'program' | 'programStage' | null
    entityId?: string
}

export const RoleAccess = () => {
    const formState = useFormState<ProgramValues>()
    const values = formState.values
    const { id: programId } = useParams()
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()
    const { show: showSuccess } = useAlert(
        i18n.t('Access updated successfully'),
        { success: true }
    )
    const { show: showError } = useAlert((message: string) => message, {
        critical: true,
    })

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        entityType: null,
        entityId: undefined,
    })

    const programStages: ProgramStageWithSharing[] = useMemo(() => {
        const stages = values.programStages as
            | ProgramStageWithSharing[]
            | undefined
        if (!stages) {
            return []
        }
        return stages.map(
            (stage): ProgramStageWithSharing => ({
                id: stage.id,
                displayName: stage.displayName || '',
                access: stage.access,
                sharing: stage.sharing,
            })
        )
    }, [values.programStages])

    const handleApplyToAllStages = useCallback(async () => {
        if (!programId || programStages.length === 0) {
            return
        }

        try {
            const programSharingResponse = (await dataEngine.query({
                sharing: {
                    resource: 'sharing',
                    params: {
                        type: 'program',
                        id: programId,
                    },
                },
            })) as { sharing?: { object: SharingSettings } }

            const programSharing = programSharingResponse.sharing?.object

            const mutations = programStages.map((stage) =>
                dataEngine.mutate({
                    resource: `sharing?type=programStage&id=${stage.id}`,
                    type: 'update',
                    data: {
                        meta: {
                            allowPublicAccess: true,
                            allowExternalAccess: true,
                        },
                        object: {
                            ...programSharing,
                            id: stage.id,
                            displayName: stage.displayName,
                        },
                    },
                } as any)
            )

            await Promise.all(mutations)
            showSuccess()

            queryClient.invalidateQueries({
                queryKey: [{ resource: 'programs', id: programId }],
            })
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : i18n.t('Failed to apply access to all stages')
            showError(errorMessage)
        }
    }, [
        programId,
        programStages,
        dataEngine,
        queryClient,
        showSuccess,
        showError,
    ])

    const handleApplyProgramAccessRules = useCallback(
        async (stageId: string) => {
            if (!programId) {
                return
            }

            try {
                const programSharingResponse = (await dataEngine.query({
                    sharing: {
                        resource: 'sharing',
                        params: {
                            type: 'program',
                            id: programId,
                        },
                    },
                })) as { sharing?: { object: SharingSettings } }

                const programSharing = programSharingResponse.sharing?.object
                const stage = programStages.find((s) => s.id === stageId)
                if (!stage) {
                    return
                }

                await dataEngine.mutate({
                    resource: `sharing?type=programStage&id=${stageId}`,
                    type: 'update',
                    data: {
                        meta: {
                            allowPublicAccess: true,
                            allowExternalAccess: true,
                        },
                        object: {
                            ...programSharing,
                            id: stageId,
                            displayName: stage.displayName,
                        },
                    },
                } as any)

                showSuccess()

                queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programs', id: programId }],
                })
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : i18n.t('Failed to apply program access rules')
                showError(errorMessage)
            }
        },
        [
            programId,
            programStages,
            dataEngine,
            queryClient,
            showSuccess,
            showError,
        ]
    )

    const handleEditAccess = useCallback(
        (type: 'program' | 'stage', stageId?: string) => {
            const entityType = type === 'program' ? 'program' : 'programStage'
            const entityId = type === 'program' ? values.id : stageId

            setModalState({
                isOpen: true,
                entityType,
                entityId,
            })
        },
        [values]
    )

    const handleCloseModal = useCallback(() => {
        setModalState({
            isOpen: false,
            entityType: null,
            entityId: undefined,
        })
    }, [])

    const handleSaveSharing = useCallback(() => {
        if (programId) {
            queryClient.invalidateQueries({
                queryKey: [{ resource: 'programs', id: programId }],
            })
        }
    }, [programId, queryClient])

    const programSharing = values.sharing

    return (
        <>
            <div className={css.container}>
                <RoleAccessBox
                    title={i18n.t('Program: {{name}}', {
                        name: values.name || i18n.t('Untitled'),
                    })}
                    type="program"
                    sharing={programSharing}
                    onApplyToAllStages={handleApplyToAllStages}
                    onEditAccess={() => handleEditAccess('program')}
                />

                {programStages.map((stage) => {
                    const isDifferentFromProgram = !areSharingPropertiesSimilar(
                        stage.sharing,
                        programSharing
                    )

                    return (
                        <RoleAccessBox
                            key={stage.id}
                            title={i18n.t('Stage: {{name}}', {
                                name: stage.displayName,
                            })}
                            type="stage"
                            sharing={stage.sharing}
                            isDifferentFromProgram={isDifferentFromProgram}
                            onApplyProgramAccessRules={() =>
                                handleApplyProgramAccessRules(stage.id)
                            }
                            onEditAccess={() =>
                                handleEditAccess('stage', stage.id)
                            }
                        />
                    )
                })}
            </div>

            {modalState.isOpen &&
                modalState.entityType &&
                modalState.entityId && (
                    <SharingDialog
                        type={modalState.entityType}
                        id={modalState.entityId}
                        onClose={handleCloseModal}
                        onSave={handleSaveSharing}
                        dataSharing={true}
                    />
                )}
        </>
    )
}
