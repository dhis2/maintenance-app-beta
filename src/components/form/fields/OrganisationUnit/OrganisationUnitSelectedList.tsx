import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import css from './OrganisationUnitSelectedList.module.css'
import { OrganisationUnitValue } from './OrganisationUnitTreeWithToolbar'

export type OrganisationUnitSelectedListProps = {
    selected: OrganisationUnitValue[]
}
export const OrganisationUnitSelectedList = ({
    selected,
}: OrganisationUnitSelectedListProps) => {
    const title =
        !selected || selected.length === 0
            ? i18n.t('No selected units')
            : i18n.t('{{numberOfUnits}} selected units', {
                  numberOfUnits: selected.length,
              })

    const sorted = useMemo(
        () =>
            selected.sort((a, b) =>
                a.displayName?.localeCompare(b?.displayName)
            ),
        [selected]
    )
    return (
        <div className={css.organisationUnitSelectedWrapper}>
            <h4 className={css.title}>{title}</h4>
            <ul className={css.organisationUnitSelectedList}>
                {sorted.map((orgUnit: OrganisationUnitValue) => (
                    <li key={orgUnit.path}>{orgUnit.displayName}</li>
                ))}
            </ul>
        </div>
    )
}
