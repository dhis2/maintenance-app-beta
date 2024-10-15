import i18n from '@dhis2/d2-i18n'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { OrganisationUnitField } from '../../../components'
import { OrganisationUnitFormValue } from '../../../components/form/fields/OrganisationUnitField'
import classes from './OrganisationUnitSelector.module.css'

export function OrganisationUnitSelector() {
    const [selectedOrgUnit, setSelectedOrgUnit] = useState<string | undefined>()

    const handleOrgUnitChanged = (orgUnits: OrganisationUnitFormValue[]) =>
        orgUnits[0]
            ? setSelectedOrgUnit(orgUnits[0].displayName)
            : setSelectedOrgUnit(undefined)

    return (
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
                            'New organisation unit will be created inside'
                        ) +
                            ' ' +
                            selectedOrgUnit}
                    </p>
                </div>
            )}
        </>
    )
}
