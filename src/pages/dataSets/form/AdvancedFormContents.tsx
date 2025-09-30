import i18n from '@dhis2/d2-i18n'
import { CheckboxField, CheckboxFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { Field, useField } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    ModelTransferField,
} from '../../../components'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { SectionedFormSection } from '../../../components/sectionedForm'

const NOTIFICATION_RECIPIENTS_QUERY = {
    resource: 'userGroups',
}

const NotificationField = () => {
    const {
        input: notificationRecipientsInput,
        meta: notificationRecipientsMeta,
    } = useField('notificationRecipients')
    const { input: notifyCompletingUserInput } = useField(
        'notifyCompletingUser'
    )
    const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
        Boolean(
            notificationRecipientsInput.value || notifyCompletingUserInput.value
        )
    )

    return (
        <>
            <StandardFormField>
                <CheckboxField
                    checked={notificationsEnabled}
                    onChange={(e) => {
                        if (!e.checked) {
                            notificationRecipientsInput.onChange(null)
                            notifyCompletingUserInput.onChange(null)
                        }
                        setNotificationsEnabled(e.checked)
                    }}
                    label={i18n.t('Send complete notifications')}
                />
            </StandardFormField>
            <div style={{ marginInlineStart: '24px' }}>
                <StandardFormField>
                    <ModelSingleSelectField
                        input={notificationRecipientsInput}
                        meta={notificationRecipientsMeta}
                        label={i18n.t('Recipient user group')}
                        query={NOTIFICATION_RECIPIENTS_QUERY}
                        disabled={!notificationsEnabled}
                    />
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="notifyCompletingUser"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Send notification to completing user')}
                        disabled={!notificationsEnabled}
                    />
                </StandardFormField>
            </div>
        </>
    )
}

export const AdvancedFormContents = React.memo(function AdvancedFormContents({
    name,
}: {
    name: string
}) {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Advanced options')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'These options are used for advanced data set configurations.'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <Field
                    name="skipOffline"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        "Don't save this data to offline storage (skip offline)"
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="dataElementDecoration"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        'Include data element descriptions in offline storage (data element decoration)'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="mobile"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t('Use this data set with Java mobile client')}
                />
            </StandardFormField>
            <StandardFormSectionTitle>
                {i18n.t('Notifications')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Send notifications when data sets are marked complete, using the DHIS2 Messages app.'
                )}
            </StandardFormSectionDescription>
            <NotificationField />
            <StandardFormSectionTitle>
                {i18n.t('Legends')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Select legends to visually categorize values for this data set in Data entry and Analytics apps.'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <ModelTransferField
                    name={'legendSets'}
                    query={{
                        resource: 'legendSets',
                    }}
                    leftHeader={i18n.t('Available legends')}
                    rightHeader={i18n.t('Selected legends')}
                    filterPlaceholder={i18n.t('Search available legends')}
                    filterPlaceholderPicked={i18n.t('Search selected legends')}
                    maxSelections={Infinity}
                    leftFooter={<></>}
                    enableOrderChange={false}
                />
            </StandardFormField>
        </SectionedFormSection>
    )
})
