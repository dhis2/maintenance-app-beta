import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    DataTableToolbar,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Radio,
} from '@dhis2/ui'
import { IconAdd24 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToolbarSelected } from '../../components'
import { DownloadDialog } from '../../components/sectionList/download'
import { ManageListViewDialog } from '../../components/sectionList/listView'
import { DefaultToolbarProps } from '../../components/sectionList/toolbar/DefaultToolbar'
import css from '../../components/sectionList/toolbar/Toolbar.module.css'
import {
    routePaths,
    useCanCreateModelInSection,
    useModelSectionHandleOrThrow,
} from '../../lib'
import { DefaultSectionList } from '../DefaultSectionList'

const NewProgramDialog = ({ onClose }: { onClose: () => void }) => {
    const [programType, setProgramType] = useState<
        'WITHOUT_REGISTRATION' | 'WITH_REGISTRATION'
    >('WITHOUT_REGISTRATION')

    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                {i18n.t('New program: choose type', {
                    nsSeparator: '~:~',
                })}
            </ModalTitle>
            <ModalContent>
                <Radio
                    dense
                    label={<div>{i18n.t('Single event')}</div>}
                    onChange={({ checked }) => {
                        if (checked) {
                            setProgramType('WITHOUT_REGISTRATION')
                        }
                    }}
                    value="WITHOUT_REGISTRATION"
                    checked={programType === 'WITHOUT_REGISTRATION'}
                />
                <Radio
                    dense
                    label={<div>{i18n.t('Tracker')}</div>}
                    onChange={({ checked }) => {
                        if (checked) {
                            setProgramType('WITH_REGISTRATION')
                        }
                    }}
                    value="WITH_REGISTRATION"
                    checked={programType === 'WITH_REGISTRATION'}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Link
                        to={`${routePaths.sectionNew}?programType=${programType}`}
                    >
                        <Button primary>{i18n.t('Create program')}</Button>
                    </Link>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
const ProgramToolbar = ({
    selectedModels,
    onDeselectAll,
    downloadable = true,
}: DefaultToolbarProps) => {
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)

    const isAnySelected = selectedModels.size > 0

    const DownloadButtonElement = downloadable ? (
        <Button small onClick={() => setDownloadDialogOpen(true)}>
            {i18n.t('Download')}
        </Button>
    ) : null

    const [manageColumnsOpen, setManageColumnsOpen] = React.useState(false)
    const [newProgramOpen, setNewProgramOpen] = React.useState(false)
    const section = useModelSectionHandleOrThrow()
    const canCreateModel = useCanCreateModelInSection(section)

    const handleClose = () => setManageColumnsOpen(false)

    return (
        <>
            {isAnySelected ? (
                <ToolbarSelected
                    selectedModels={selectedModels}
                    onDeselectAll={onDeselectAll}
                    downloadButtonElement={DownloadButtonElement}
                />
            ) : (
                <DataTableToolbar className={css.listHeaderNormal}>
                    {canCreateModel && (
                        <Button
                            small
                            icon={<IconAdd24 />}
                            onClick={() => setNewProgramOpen(true)}
                        >
                            {i18n.t('New')}
                        </Button>
                    )}
                    {DownloadButtonElement}
                    <Button
                        small
                        dataTest="manage-view-button"
                        onClick={() => setManageColumnsOpen((prev) => !prev)}
                    >
                        {i18n.t('Manage View')}
                    </Button>
                    {manageColumnsOpen && (
                        <ManageListViewDialog onClose={handleClose} />
                    )}
                </DataTableToolbar>
            )}
            {downloadDialogOpen && (
                <DownloadDialog
                    onClose={() => setDownloadDialogOpen(false)}
                    selectedModels={selectedModels}
                />
            )}
            {newProgramOpen && (
                <NewProgramDialog onClose={() => setNewProgramOpen(false)} />
            )}
        </>
    )
}

export const Component = () => (
    <DefaultSectionList ToolbarComponent={ProgramToolbar} />
)
