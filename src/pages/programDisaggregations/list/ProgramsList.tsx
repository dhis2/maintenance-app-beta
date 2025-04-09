import { useAlert, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { UpdateMutation, useLocationSearchState } from '../../../lib'
import { Program } from '../../../types/generated'
import classes from './ProgramsList.module.css'

export interface ProgramsData {
    results: {
        programs: Program[]
    }
}

const programsQuery = {
    resource: 'programs',
    params: {
        fields: ['displayName', 'id', 'categoryMappings[id]'],
    },
}

const programsQueryResults = {
    results: {
        resource: 'programs/gist',
        params: {
            fields: ['name', 'displayName', 'id', 'categoryMappings'],
            order: 'name:asc',
            pageSize: 200,
            // filter: 'categoryMappings:!empty',
        },
    },
}

export const ProgramsList = () => {
    const preservedSearchState = useLocationSearchState()
    const { loading, error, data, refetch } =
        useDataQuery<ProgramsData>(programsQueryResults)
    const navigate = useNavigate()
    const dataEngine = useDataEngine()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [programToDelete, setProgramToDelete] = useState<Program | null>(null)

    const programs = data?.results?.programs || []
    const programsWithMappings = programs.filter(
        (p) => p.categoryMappings?.length > 0
    )

    const handleSelectChange = (
        selected:
            | { id: string; categoryMappings?: { id: string }[] }
            | undefined
    ) => {
        if (selected?.id) {
            navigate(`${selected.id}`, { state: preservedSearchState })
        }
    }

    const handleEdit = (id: string) => {
        navigate(`${id}`, { state: preservedSearchState })
    }

    const handleDeleteClick = (program: Program) => {
        setProgramToDelete(program)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        const mutation = {
            type: 'json-patch',
            resource: `programs`,
            id: programToDelete?.id,
            partial: true,
            data: [
                {
                    op: 'replace',
                    path: `/categoryMappings`,
                    value: [],
                },
            ],
        } as UpdateMutation
        try {
            await dataEngine.mutate(mutation)
            refetch()
        } catch {
            saveAlert.show({
                message: i18n.t('Cannot delete programs mappings'),
                error: true,
            })
        }
        setDeleteModalOpen(false)
        setProgramToDelete(null)
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false)
        setProgramToDelete(null)
    }

    return (
        <div className={classes.programsList}>
            <ModelSingleSelect
                query={programsQuery}
                onChange={handleSelectChange}
                transform={(results) =>
                    results.map((result) =>
                        result.categoryMappings &&
                        result.categoryMappings.length > 0
                            ? { ...result, disabled: true }
                            : result
                    )
                }
                placeholder={i18n.t('Select a Program')}
            />

            <h3>{i18n.t('Programs with existing mappings')}</h3>

            {loading && <LoadingSpinner />}
            {error && (
                <NoticeBox title={i18n.t('Error')} error>
                    {i18n.t('Could not load programs.')} <br />
                    <Button
                        small
                        onClick={refetch}
                        className={classes.errorNoticeButton}
                    >
                        {i18n.t('Retry')}
                    </Button>
                </NoticeBox>
            )}

            {programsWithMappings.length > 0 ? (
                <div>
                    {programsWithMappings.map((program) => (
                        <div
                            key={program.id}
                            className={classes.programsListItem}
                        >
                            <span>{program.name}</span>
                            <div className={classes.programsListItemActions}>
                                <Button
                                    small
                                    secondary
                                    onClick={() => handleEdit(program.id)}
                                >
                                    {i18n.t('Edit')}
                                </Button>
                                <Button
                                    small
                                    destructive
                                    secondary
                                    onClick={() => handleDeleteClick(program)}
                                >
                                    {i18n.t('Delete')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loading &&
                !error && (
                    <p>{i18n.t('No programs with existing mappings found.')}</p>
                )
            )}

            {deleteModalOpen && programToDelete && (
                <Modal onClose={handleCancelDelete} position="middle">
                    <ModalTitle>{i18n.t('Delete Mapping')}</ModalTitle>
                    <ModalContent>
                        <h4>{i18n.t('This action cannot be undone.')}</h4>
                        <p>
                            {i18n.t(
                                'All mappings ({{disaggregationMappingsLength}}) will be removed',
                                {
                                    disaggregationMappingsLength:
                                        programToDelete.categoryMappings.length,
                                }
                            )}
                        </p>
                        <p>
                            {i18n.t(
                                'Are you sure you want to delete this program mapping configuration?'
                            )}
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button onClick={handleCancelDelete}>Cancel</Button>
                            <Button destructive onClick={handleConfirmDelete}>
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    )
}
