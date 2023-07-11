import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { IconAdd24 } from '@dhis2/ui-icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '../../app/routes/routePaths'
import css from './SectionList.module.css'

export const SelectionListHeader = () => {
    return (
        <div className={css.listHeaderNormal}>
            <Link to={routePaths.sectionNew}>
                <Button small icon={<IconAdd24 />}>
                    {i18n.t('New')}
                </Button>
            </Link>
            <Button small>{i18n.t('Download')}</Button>
            <Button small>{i18n.t('Manage Columns')}</Button>
        </div>
    )
}
