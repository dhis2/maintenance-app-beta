import i18n from '@dhis2/d2-i18n'
import { Button, DataTableToolbar } from '@dhis2/ui'
import { IconAdd24 } from '@dhis2/ui-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '../../lib'
import { ManageListViewDialog } from './listView/ManageListViewDialog'
import css from './SectionList.module.css'

export const SectionListHeader = () => {
    const [manageColumnsOpen, setManageColumnsOpen] = React.useState(false)

    const handleClose = () => setManageColumnsOpen(false)
    return (
        <div className={css.listHeaderNormal}>
            <Link to={routePaths.sectionNew}>
                <Button small icon={<IconAdd24 />}>
                    {i18n.t('New')}
                </Button>
            </Link>
            <Button small>{i18n.t('Download')}</Button>
            <Button small onClick={() => setManageColumnsOpen((prev) => !prev)}>
                {i18n.t('Manage Columns')}
            </Button>
            {manageColumnsOpen && (
                <ManageListViewDialog onClose={handleClose} />
            )}
        </div>
    )
}
