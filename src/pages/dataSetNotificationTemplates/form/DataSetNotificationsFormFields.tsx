import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    MessageFields,
    MessageVariables,
} from '../../../components'
import { SECTIONS_MAP, useSyncSelectedSectionWithScroll } from '../../../lib'
import { BasicInformationSection } from './BasicInformationSection'
import { NotificationTimingSection } from './NotificationTimingSection'
import { RecipientSection } from './RecipientSection'

export const DATA_SET_VARIABLES = {
    data_set_name: { label: i18n.t('Data set name'), type: 'VARIABLE' },
    current_date: { label: i18n.t('Current date'), type: 'VARIABLE' },
    data_description: {
        label: i18n.t('Data set description'),
        type: 'VARIABLE',
    },
    registration_ou: {
        label: i18n.t('Complete registration organisation unit'),
        type: 'VARIABLE',
    },
    registration_period: {
        label: i18n.t('Complete registration period'),
        type: 'VARIABLE',
    },
    registration_user: {
        label: i18n.t('Complete registration user'),
        type: 'VARIABLE',
    },
    registration_time: {
        label: i18n.t('Complete registration time'),
        type: 'VARIABLE',
    },
    att_opt_combo: {
        label: i18n.t('Complete registration att opt combo'),
        type: 'VARIABLE',
    },
} as MessageVariables

export const DataSetNotificationsFormFields = () => {
    const section = SECTIONS_MAP.dataSetNotificationTemplate
    useSyncSelectedSectionWithScroll()

    return (
        <div>
            <SectionedFormSections>
                <SectionedFormSection name="basicInformation">
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Set up the basic information for the notification template.'
                        )}
                    </StandardFormSectionDescription>
                    <BasicInformationSection section={section} />
                </SectionedFormSection>

                <SectionedFormSection name="messageContent">
                    <StandardFormSectionTitle>
                        {i18n.t('Message content')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure the templates for the notification content and subject.'
                        )}
                    </StandardFormSectionDescription>
                    <MessageFields
                        messageVariables={DATA_SET_VARIABLES}
                        messageTemplateRequired={true}
                    />
                </SectionedFormSection>

                <SectionedFormSection name="notificationTiming">
                    <StandardFormSectionTitle>
                        {i18n.t('Notification timing')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose what triggers the notification and when it should be sent.'
                        )}
                    </StandardFormSectionDescription>
                    <NotificationTimingSection />
                </SectionedFormSection>

                <SectionedFormSection name="recipient">
                    <StandardFormSectionTitle>
                        {i18n.t('Recipient')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Choose who receives the notification.')}
                    </StandardFormSectionDescription>
                    <RecipientSection />
                </SectionedFormSection>
            </SectionedFormSections>
        </div>
    )
}
