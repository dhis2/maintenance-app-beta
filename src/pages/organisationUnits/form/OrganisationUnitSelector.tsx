import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { OrganisationUnitField } from '../../../components'
import { OrganisationUnitFormValue } from '../../../components/form/fields/OrganisationUnitField'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import classes from './OrganisationUnitSelector.module.css'

export function OrganisationUnitSelector() {
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<string | undefined>()

    const handleOrgUnitChanged = (orgUnits: OrganisationUnitFormValue[]) =>
        orgUnits[0]
            ? setSelectedOrgUnit(orgUnits[0].displayName)
            : setSelectedOrgUnit(undefined)

    const userRootOrgUnits = useCurrentUserRootOrgUnits()

    return userRootOrgUnits.length > 0 ? (
        <>
            <div className={classes.selectedOrgUnitBox}>
                <OrganisationUnitField
                    name={'parent'}
                    singleSelection
                    onChange={handleOrgUnitChanged}
                />
            </div>
            {selectedOrgUnit && (
                <div className={classes.selectedOrgUnitInfo}>
                    <IconInfo16 />
                    <p>
                        {i18n.t(
                            'New organisation unit will be created inside {{selectedOrgUnit}}',
                            { selectedOrgUnit }
                        )}
                    </p>
                </div>
            )}
        </>
    ) : (
        <NoticeBox title={i18n.t('Creating first organisation unit')}>
            {i18n.t(
                'This is the first organisation unit and will be created as the root of the hierarchy.'
            )}
        </NoticeBox>
    )
}
