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
import cx from 'classnames'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToolbarSelected } from '../../components'
import { DownloadDialog } from '../../components/sectionList/download'
import { ManageListViewDialog } from '../../components/sectionList/listView'
import { DefaultToolbarProps } from '../../components/sectionList/toolbar/DefaultToolbar'
import {
    routePaths,
    useCanCreateModelInSection,
    useModelSectionHandleOrThrow,
} from '../../lib'
import { DefaultSectionList } from '../DefaultSectionList'
import css from './List.module.css'

const IconToBeReplaced = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M31 16L24 23L22.59 21.59L28.17 16L22.59 10.41L24 9L31 16ZM1 16L8 9L9.41 10.41L3.83 16L9.41 21.59L8 23L1 16Z" />
        <path d="M12.4199 25.4835L17.6403 6.0008L19.5722 6.51843L14.3518 26.0012L12.4199 25.4835Z" />
    </svg>
)

const IconToBeReplaced2 = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 4H4V8H28V4ZM2 2V10H30V2H2Z"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 14H4V18H28V14ZM2 12V20H30V12H2Z"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 24H4V28H28V24ZM2 22V30H30V22H2Z"
        />
    </svg>
)

const ProgramTypeCard = ({
    Icon,
    label,
    description,
}: {
    Icon: React.ComponentType
    label: string
    description: string
}) => {
    return (
        <div className={css.programTypeCardContent}>
            {<Icon />}
            <div className={css.programTypeTitle}>
                <h3>{label}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}

const NewProgramDialog = ({ onClose }: { onClose: () => void }) => {
    const [programType, setProgramType] = useState<
        'WITHOUT_REGISTRATION' | 'WITH_REGISTRATION'
    >('WITHOUT_REGISTRATION')

    return (
        <Modal large onClose={onClose}>
            <ModalTitle>
                {i18n.t('New program: choose type', {
                    nsSeparator: '~:~',
                })}
            </ModalTitle>
            <ModalContent>
                <p className={css.programTypeDescription}>
                    {i18n.t(
                        "What type of program is this? This affects how the program is set up and how data is collected. The program type can't be changed in the future"
                    )}
                </p>
                <div className={css.programTypeCards}>
                    <Radio
                        className={cx(css.programTypeCard, {
                            [css.programTypeCardHighlighted]:
                                programType === 'WITHOUT_REGISTRATION',
                        })}
                        dense
                        label={
                            <ProgramTypeCard
                                label={i18n.t('Single event')}
                                description={i18n.t(
                                    'Anonymous, individual events are recorded without registration. No person or entity is attached to these individual transactions.'
                                )}
                                Icon={IconToBeReplaced}
                            />
                        }
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
                        className={cx(css.programTypeCard, {
                            [css.programTypeCardHighlighted]:
                                programType === 'WITH_REGISTRATION',
                        })}
                        label={
                            <ProgramTypeCard
                                label={i18n.t('Tracker')}
                                description={i18n.t(
                                    'An entity (like a person, student or commodity) is tracked through every recorded event with the system. Events are always attached to the entity.'
                                )}
                                Icon={IconToBeReplaced2}
                            />
                        }
                        onChange={({ checked }) => {
                            if (checked) {
                                setProgramType('WITH_REGISTRATION')
                            }
                        }}
                        value="WITH_REGISTRATION"
                        checked={programType === 'WITH_REGISTRATION'}
                    />
                </div>
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
