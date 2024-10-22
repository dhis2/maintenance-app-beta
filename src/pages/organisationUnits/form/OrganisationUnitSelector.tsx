import i18n from '@dhis2/d2-i18n'
import { Field, NoticeBox, OrganisationUnitTree } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import classes from './OrganisationUnitSelector.module.css'

export function OrganisationUnitSelector() {
    const fieldName = 'parent'
    const { input, meta } = useField(fieldName, { format: (value) => value })
    const userRootOrgUnits = useCurrentUserRootOrgUnits()
    const userRootOrgUnitsIds = userRootOrgUnits.map((unit) => `/${unit.id}`)
    const [selected, setSelected] = useState<[string] | []>([])

    const handleChange = (orgUnit: {
        displayName: string
        id: string
        path: string
    }) => {
        input.onChange({
            displayName: orgUnit.displayName,
            id: orgUnit.id,
            path: orgUnit.path,
        })
        setSelected([orgUnit.path])
        input.onBlur()
    }

    return (
        <Field
            error={meta.touched && meta.error}
            validationText={meta.touched ? meta.error : undefined}
        >
            {userRootOrgUnits.length > 0 ? (
                <>
                    <div className={classes.selectedOrgUnitBox}>
                        <OrganisationUnitTree
                            onChange={handleChange}
                            singleSelection
                            roots={userRootOrgUnitsIds}
                            selected={selected}
                            initiallyExpanded={userRootOrgUnitsIds}
                        />
                    </div>
                    {input.value?.displayName && (
                        <div className={classes.selectedOrgUnitInfo}>
                            <IconInfo16 />
                            <p>
                                {i18n.t(
                                    'New organisation unit will be created inside {{displayName}}',
                                    { displayName: input.value.displayName }
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
            )}
        </Field>
    )
}
