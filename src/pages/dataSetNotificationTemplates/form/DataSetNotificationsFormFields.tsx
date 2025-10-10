import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    MessageFields,
} from '../../../components'
import { SECTIONS_MAP, useSyncSelectedSectionWithScroll } from '../../../lib'
import { BasicInformationSection } from './BasicInformationSection'
import { NotificationTimingSection } from './NotificationTimingSection'
import { RecipientSection } from './RecipientSection'

export const DATA_SET_VARIABLES = {
    data_set_name: i18n.t('Data set name'),
    current_date: i18n.t('Current date'),
    data_description: i18n.t('Data set description'),
    registration_ou: i18n.t('Complete registration organisation unit'),
    registration_period: i18n.t('Complete registration period'),
    registration_user: i18n.t('Complete registration user'),
    registration_time: i18n.t('Complete registration time'),
    att_opt_combo: i18n.t('Complete registration att opt combo'),
} as Record<string, string>

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
                        {i18n.t('Choose who recieves the notification.')}
                    </StandardFormSectionDescription>
                    <RecipientSection />
                </SectionedFormSection>
            </SectionedFormSections>
        </div>
    )
}
