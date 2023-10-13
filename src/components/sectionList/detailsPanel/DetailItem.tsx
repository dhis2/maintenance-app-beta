import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { selectedLocale } from '../../../lib/date/locale'
import css from './DetailsPanel.module.css'

type DetailItemProps = {
    children: React.ReactNode
    label: string
}

export const DetailItem = ({ label, children }: DetailItemProps) => {
    return (
        <div className={css.detailItem}>
            <div className={css.detailItemLabel}>{label}</div>
            <div className={css.detailItemValue}>{children}</div>
        </div>
    )
}

export const ApiUrlValue = ({ value }: { value: string }) => {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(value)
    }
    return (
        <span>
            <a href={value} target="_blank" rel="noopener noreferrer">
                API URL link
            </a>
            <Button
                className={css.detailItemValueButton}
                small
                secondary
                onClick={handleCopyToClipboard}
            >
                {i18n.t('Copy')}
            </Button>
        </span>
    )
}

const dateTimeFormater = new Intl.DateTimeFormat(selectedLocale, {
    dateStyle: 'short',
    timeStyle: 'short',
})

export const DateValue = ({ value }: { value: string }) => {
    const date = new Date(value)
    const formattedDate = dateTimeFormater.format(date)
    return formattedDate
}
