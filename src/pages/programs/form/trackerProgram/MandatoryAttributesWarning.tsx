import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import styles from './MandatoryAttributesWarning.module.css'

type MissingAttribute = {
    trackedEntityAttribute: { id: string; displayName: string }
}

type Props = {
    missingAttributes: MissingAttribute[]
    className?: string
}

export const MandatoryAttributesWarning = ({
    missingAttributes,
    className,
}: Props) => {
    if (missingAttributes.length === 0) {
        return null
    }
    return (
        <NoticeBox
            warning
            className={className ?? styles.noticeBox}
            title={i18n.t(
                'Mandatory tracked entity attributes are not included in this form.'
            )}
        >
            <div className={styles.description}>
                {i18n.t(
                    'The following attributes are marked as required but not assigned to any section:',
                    { nsSeparator: '~:~' }
                )}
            </div>
            <ul className={styles.list}>
                {missingAttributes.map(({ trackedEntityAttribute }) => (
                    <li key={trackedEntityAttribute.id}>
                        {trackedEntityAttribute.displayName}
                    </li>
                ))}
            </ul>
        </NoticeBox>
    )
}
