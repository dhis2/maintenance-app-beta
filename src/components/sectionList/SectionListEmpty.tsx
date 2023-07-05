import i18n from '@dhis2/d2-i18n'
import { DataTableRow, DataTableCell } from '@dhis2/ui'
import React from 'react'
import css from './SectionList.module.css'

export const SectionListEmpty = () => {
    return (
        <DataTableRow>
            <DataTableCell colSpan="100%">
                <p className={css.listEmpty}>
                    {i18n.t(
                        "There's no items that match your selected filter."
                    )}
                </p>
            </DataTableCell>
        </DataTableRow>
    )
}
