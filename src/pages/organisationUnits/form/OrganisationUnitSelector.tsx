import i18n from '@dhis2/d2-i18n'
import { NoticeBox, OrganisationUnitTree } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import classes from './OrganisationUnitSelector.module.css'

export function OrganisationUnitSelector() {
    const fieldName = 'parent'
    const { input } = useField(fieldName)
    const userRootOrgUnits = useCurrentUserRootOrgUnits()
    const userRootOrgUnitsIds = userRootOrgUnits.map((unit) => `/${unit.id}`)
    const [selected, setSelected] = useState<[string] | []>([])
    const handleChange = (orgUnit: {
        displayName: string
        id: string
        path: string
    }) => {
        input.onChange({ label: orgUnit.displayName, id: orgUnit.id })
        setSelected([orgUnit.path])
    }

    return (
        <FieldRFF<string | undefined> name={fieldName}>
            {() => {
                return userRootOrgUnits.length > 0 ? (
                    <>
                        <div className={classes.selectedOrgUnitBox}>
                            <OrganisationUnitTree
                                onChange={handleChange}
                                singleSelection
                                roots={userRootOrgUnitsIds}
                                selected={selected}
                                // highlighted={input.value?.id ? [`/${input.value.id}`] : []}
                                initiallyExpanded={userRootOrgUnitsIds}
                            />
                        </div>
                        {input.value?.label && (
                            <div className={classes.selectedOrgUnitInfo}>
                                <IconInfo16 />
                                <p>
                                    {i18n.t(
                                        'New organisation unit will be created inside'
                                    ) +
                                        ' ' +
                                        input.value.label}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <NoticeBox
                        title={i18n.t('Creating first organisation unit')}
                    >
                        {i18n.t(
                            'This is the first organisation unit and will be created as the root of the hierarchy.'
                        )}
                    </NoticeBox>
                )
            }}
        </FieldRFF>
    )
}
