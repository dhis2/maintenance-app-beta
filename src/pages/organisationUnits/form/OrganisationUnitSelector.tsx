import i18n from '@dhis2/d2-i18n'
import { Field, NoticeBox, OrganisationUnitTree } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React from 'react'
import { useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import classes from './OrganisationUnitSelector.module.css'

export function OrganisationUnitSelector() {
    const fieldName = 'parent'
    const { input, meta } = useField(fieldName, {
        format: (value) => value,
        validate: (value) =>
            !value && userRootOrgUnits.length > 0 ? 'Required' : undefined,
    })
    const userRootOrgUnits = useCurrentUserRootOrgUnits()
    const userRootOrgUnitsIds = userRootOrgUnits.map((unit) => unit.id)
    const userRootOrgUnitsPaths = userRootOrgUnits.map((unit) => unit.path)
    const selectedPath = input.value?.path ? [input.value.path] : []

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
        input.onBlur()
    }

    return (
        <Field
            name="parent"
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
                            selected={selectedPath}
                            initiallyExpanded={[
                                ...userRootOrgUnitsPaths,
                                ...selectedPath,
                            ]}
                        />
                    </div>
                    {input.value?.displayName && (
                        <div className={classes.selectedOrgUnitInfo}>
                            <IconInfo16 />
                            <p>
                                {i18n.t(
                                    'Organisation unit will be positioned inside {{displayName}}',
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
