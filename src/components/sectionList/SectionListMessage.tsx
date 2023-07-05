import i18n from '@dhis2/d2-i18n'
import { DataTableRow, DataTableCell, NoticeBox } from '@dhis2/ui'
import React, { PropsWithChildren } from 'react'
import css from './SectionList.module.css'

export const SectionListMessage = ({ children }: PropsWithChildren) => {
    return (
        <DataTableRow>
            <DataTableCell colSpan="100%">{children}</DataTableCell>
        </DataTableRow>
    )
}

export const SectionListEmpty = () => {
    return (
        <SectionListMessage>
            <p className={css.listEmpty}>
                {i18n.t("There aren't any items that match your filter.")}
            </p>
        </SectionListMessage>
    )
}

export const SectionListError = () => {
    return (
        <SectionListMessage>
            <NoticeBox error={true} title={i18n.t('An error occurred')}>
                {i18n.t('An error occurred while loading the items.')}
            </NoticeBox>
        </SectionListMessage>
    )
}
