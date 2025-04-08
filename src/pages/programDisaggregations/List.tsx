import { useDataQuery } from '@dhis2/app-runtime'
import {
    Button,
    NoticeBox,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchableSingleSelect } from '../../components'
import { useLocationSearchState } from '../../lib'
import { Program } from '../../types/generated'

export interface ProgramsData {
    results: {
        programs: Program[]
    }
}

const programsQuery = {
    results: {
        resource: 'programs',
        params: {
            fields: [
                'name',
                'id',
                'categoryMappings[id,categoryId,mappingName,optionMappings[optionId,filter]]',
            ],
        },
    },
}

export const Component: React.FC = () => {
    const preservedSearchState = useLocationSearchState()
    const { loading, error, data, refetch } =
        useDataQuery<ProgramsData>(programsQuery)
    const navigate = useNavigate()

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [programToDelete, setProgramToDelete] = useState<Program | null>(null)

    const programs = data?.results?.programs || []
    const programsWithMappings = programs.filter(
        (p) => p.categoryMappings?.length > 0
    )

    const programOptions = programs.map((p) => ({
        value: p.id,
        label: p.name,
    }))

    const handleSelectChange = ({ selected }: { selected: string }) => {
        navigate('new', {
            state: {
                programId: selected,
                ...preservedSearchState,
            },
        })
    }

    const handleEdit = (id: string) => {
        navigate(`${id}`, { state: preservedSearchState })
    }

    const handleDeleteClick = (program: Program) => {
        setProgramToDelete(program)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        console.log('Deleting program:', programToDelete)
        setDeleteModalOpen(false)
        setProgramToDelete(null)
    }

    const handleCancelDelete = () => {
        setDeleteModalOpen(false)
        setProgramToDelete(null)
    }

    return (
        <div style={{ width: '60%' }}>
            {!loading && !error && (
                <div style={{ width: '50%', marginBottom: 16 }}>
                    <SearchableSingleSelect
                        options={programOptions}
                        onChange={handleSelectChange}
                        placeholder="Select a Program"
                        showAllOption={false}
                        searchable={true}
                        onRetryClick={refetch}
                        showEndLoader={false}
                        loading={loading}
                    />
                </div>
            )}

            {loading && <p>Loading programs...</p>}
            {error && (
                <NoticeBox title="Error">
                    Could not load programs.{' '}
                    <Button small onClick={refetch}>
                        Retry
                    </Button>
                </NoticeBox>
            )}

            <h3 style={{ marginTop: 32 }}>Programs with existing mappings</h3>

            {programsWithMappings.length > 0 ? (
                <div>
                    {programsWithMappings.map((program) => (
                        <div
                            key={program.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                marginBottom: 8,
                                border: '1px solid #E0E0E0',
                                borderRadius: 4,
                                background: '#fff',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <span>{program.name}</span>
                            <div>
                                <Button
                                    small
                                    secondary
                                    onClick={() => handleEdit(program.id)}
                                    style={{ marginRight: 8 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    small
                                    destructive
                                    secondary
                                    onClick={() => handleDeleteClick(program)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No programs with existing mappings found.</p>
            )}

            {/* Delete confirmation modal */}
            {deleteModalOpen && programToDelete && (
                <Modal onClose={handleCancelDelete} position="middle">
                    <ModalTitle>Delete Mapping</ModalTitle>
                    <ModalContent>
                        All mappings will be removed (2 disaggregation mappings,
                        3 attribute mappings). This action cannot be undone.
                        <br />
                        <br />
                        Are you sure you want to delete this program mapping
                        configuration?
                    </ModalContent>
                    <ModalActions>
                        <Button onClick={handleCancelDelete}>Cancel</Button>
                        <Button destructive onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </ModalActions>
                </Modal>
            )}
        </div>
    )
}
