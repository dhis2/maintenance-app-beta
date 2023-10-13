import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { PropsWithChildren } from 'react'
import css from './DetailsPanel.module.css'

type DetailItemProps = {
    label: string
    value: string
    propertyKey: string
}

const dateFieldKeys = ['created', 'lastUpdated']
const isDateKey = (key: string) => dateFieldKeys.includes(key)

export const DetailItem = ({ label, value, propertyKey }: DetailItemProps) => {
    let ValueElement: React.ReactNode = value

    if (propertyKey === 'href') {
        ValueElement = <ApiUrlValue value={value} />
    }

    if (isDateKey(propertyKey)) {
        ValueElement = <span>{new Date(value).toLocaleString()}</span>
    }

    return (
        <div className={css.detailItem}>
            <div className={css.detailItemLabel}>{label}</div>
            <div className={css.detailItemValue}>{ValueElement}</div>
        </div>
    )
}

const ApiUrlValue = ({ value }: { value: string }) => {
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
