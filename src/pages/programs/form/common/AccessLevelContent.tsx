import i18n from '@dhis2/d2-i18n'
import { Help, Radio } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import styles from './AccessLevelContent.module.css'

const ACCESS_LEVEL_OPTIONS = [
    {
        value: 'OPEN',
        label: i18n.t('Open'),
        helpText: i18n.t(
            'Users can open tracked entities in their search or capture scope.'
        ),
    },
    {
        value: 'AUDITED',
        label: i18n.t('Audited'),
        helpText: i18n.t(
            'Users can open tracked entities in their search or capture scope. Opening outside capture scope is logged.'
        ),
    },
    {
        value: 'PROTECTED',
        label: i18n.t('Protected'),
        helpText: i18n.t(
            'Users can open tracked entities in their capture scope. To open outside capture scope (but within search scope), users must give a reason for temporary access. All access is logged.'
        ),
    },
    {
        value: 'CLOSED',
        label: i18n.t('Closed'),
        helpText: i18n.t(
            'Users can only open tracked entities in their capture scope.'
        ),
    },
] as const

export const AccessLevelContent = () => {
    return (
        <Field name="accessLevel">
            {({ input }) => (
                <>
                    {ACCESS_LEVEL_OPTIONS.map((option) => (
                        <div key={option.value} className={styles.radioBox}>
                            <Radio
                                label={option.label}
                                checked={input.value === option.value}
                                onChange={() => input.onChange(option.value)}
                            />
                            <Help className={styles.radioHelpText}>
                                {option.helpText}
                            </Help>
                        </div>
                    ))}
                </>
            )}
        </Field>
    )
}
