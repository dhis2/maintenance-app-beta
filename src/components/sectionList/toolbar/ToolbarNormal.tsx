import i18n from '@dhis2/d2-i18n'
import { Button, DataTableToolbar } from '@dhis2/ui'
import { IconAdd24 } from '@dhis2/ui-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import {
    routePaths,
    useCanCreateModelInSection,
    useLocationSearchState,
    useModelSectionHandleOrThrow,
} from '../../../lib'
import { ManageListViewDialog } from '../listView/ManageListViewDialog'
import css from './Toolbar.module.css'

type ToolbarNormalProps = {
    downloadButtonElement: JSX.Element | null
}

export const ToolbarNormal = ({
    downloadButtonElement,
}: ToolbarNormalProps) => {
    const [manageColumnsOpen, setManageColumnsOpen] = React.useState(false)
    const section = useModelSectionHandleOrThrow()
    const canCreateModel = useCanCreateModelInSection(section)
    const locationState = useLocationSearchState()

    const handleClose = () => setManageColumnsOpen(false)
    return (
        <DataTableToolbar className={css.listHeaderNormal}>
            {canCreateModel && (
                <Link to={routePaths.sectionNew} state={locationState}>
                    <Button small icon={<IconAdd24 />}>
                        {i18n.t('New')}
                    </Button>
                </Link>
            )}
            {downloadButtonElement}
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
    )
}
