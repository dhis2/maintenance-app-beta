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
    sharing?: SharingSettings
}

type ModalState =
    | {
          isOpen: boolean
          entityType: 'program' | 'programStage'
          entityId: string
      }
    | {
          isOpen: false
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
    })

    const programStages = useMemo(
        () => (values.programStages || []) as ProgramStageWithSharing[],
        [values.programStages]
    )

    const handleApplyToAllStages = useCallback(async () => {
        if (!programId) {
            return
        }

        try {
            const { sharing } = (await dataEngine.query({
                sharing: {
                    resource: 'sharing',
                    params: { type: 'program', id: programId },
                },
            })) as { sharing: { object: SharingSettings } }

            await Promise.all(
                programStages.map((stage) =>
                    dataEngine.mutate({
                        resource: `sharing?type=programStage&id=${stage.id}`,
                        type: 'update',
                        id: stage.id,
                        data: {
                            meta: {
                                allowPublicAccess: true,
                                allowExternalAccess: true,
                            },
                            object: {
                                ...sharing.object,
                                id: stage.id,
                                displayName: stage.displayName,
                            },
                        },
                    })
                )
            )

            showSuccess()
            queryClient.invalidateQueries({
                queryKey: [{ resource: 'programs', id: programId }],
            })
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : i18n.t('Failed to apply access to all stages')
            )
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

            const stage = programStages.find((s) => s.id === stageId)
            if (!stage) {
                return
            }

            try {
                const { sharing } = (await dataEngine.query({
                    sharing: {
                        resource: 'sharing',
                        params: { type: 'program', id: programId },
                    },
                })) as { sharing: { object: SharingSettings } }

                await dataEngine.mutate({
                    resource: `sharing?type=programStage&id=${stageId}`,
                    type: 'update',
                    id: stageId,
                    data: {
                        meta: {
                            allowPublicAccess: true,
                            allowExternalAccess: true,
                        },
                        object: {
                            ...sharing.object,
                            id: stageId,
                            displayName: stage.displayName,
                        },
                    },
                })

                showSuccess()
                queryClient.invalidateQueries({
                    queryKey: [{ resource: 'programs', id: programId }],
                })
            } catch (error) {
                showError(
                    error instanceof Error
                        ? error.message
                        : i18n.t('Failed to apply program access rules')
                )
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
            setModalState({
                isOpen: true,
                entityType: type === 'program' ? 'program' : 'programStage',
                entityId: type === 'program' ? values.id : stageId!,
            })
        },
        [values.id]
    )

    const handleCloseModal = useCallback(() => {
        setModalState({ isOpen: false })
    }, [])

    const handleSaveSharing = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: [{ resource: 'programs', id: programId }],
        })
    }, [programId, queryClient])

    return (
        <>
            <div className={css.container}>
                <RoleAccessBox
                    title={i18n.t('Program: {{name}}', {
                        name: values.name || i18n.t('Untitled'),
                    })}
                    type="program"
                    sharing={values.sharing}
                    onApplyToAllStages={handleApplyToAllStages}
                    onEditAccess={() => handleEditAccess('program')}
                />

                {programStages.map((stage) => (
                    <RoleAccessBox
                        key={stage.id}
                        title={i18n.t('Stage: {{name}}', {
                            name: stage.displayName,
                        })}
                        type="stage"
                        sharing={stage.sharing}
                        isDifferentFromProgram={
                            !areSharingPropertiesSimilar(
                                stage.sharing,
                                values.sharing
                            )
                        }
                        onApplyProgramAccessRules={() =>
                            handleApplyProgramAccessRules(stage.id)
                        }
                        onEditAccess={() => handleEditAccess('stage', stage.id)}
                    />
                ))}
            </div>

            {modalState.isOpen && (
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
