import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { useSyncSelectedSectionWithScroll } from '../../../../lib'
import { BasicInformationSection } from './BasicInformationSection'
import { notificationSchemaSection } from './NotificationForm'

export const ProgramNotificationsFormFields = ({
    setSelectedSection,
}: {
    setSelectedSection: (name: string) => void
}) => {
    const section = notificationSchemaSection
    useSyncSelectedSectionWithScroll(setSelectedSection)

    return (
        <div>
            <SectionedFormSections>
                <SectionedFormSection name="basicInformation">
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Set up the basic information for the programNotification template.'
                        )}
                    </StandardFormSectionDescription>
                    <BasicInformationSection section={section} />
                </SectionedFormSection>

                {/*<SectionedFormSection name="messageContent">*/}
                {/*    <StandardFormSectionTitle>*/}
                {/*        {i18n.t('Message content')}*/}
                {/*    </StandardFormSectionTitle>*/}
                {/*    <StandardFormSectionDescription>*/}
                {/*        {i18n.t(*/}
                {/*            'Configure the templates for the notification content and subject.'*/}
                {/*        )}*/}
                {/*    </StandardFormSectionDescription>*/}
                {/*    <MessageFields*/}
                {/*        messageVariables={DATA_SET_VARIABLES}*/}
                {/*        messageTemplateRequired={true}*/}
                {/*    />*/}
                {/*</SectionedFormSection>*/}

                {/*<SectionedFormSection name="notificationTiming">*/}
                {/*    <StandardFormSectionTitle>*/}
                {/*        {i18n.t('Notification timing')}*/}
                {/*    </StandardFormSectionTitle>*/}
                {/*    <StandardFormSectionDescription>*/}
                {/*        {i18n.t(*/}
                {/*            'Choose what triggers the notification and when it should be sent.'*/}
                {/*        )}*/}
                {/*    </StandardFormSectionDescription>*/}
                {/*    <NotificationTimingSection />*/}
                {/*</SectionedFormSection>*/}

                {/*<SectionedFormSection name="recipient">*/}
                {/*    <StandardFormSectionTitle>*/}
                {/*        {i18n.t('Recipient')}*/}
                {/*    </StandardFormSectionTitle>*/}
                {/*    <StandardFormSectionDescription>*/}
                {/*        {i18n.t('Choose who recieves the notification.')}*/}
                {/*    </StandardFormSectionDescription>*/}
                {/*    <RecipientSection />*/}
                {/*</SectionedFormSection>*/}
            </SectionedFormSections>
        </div>
    )
}
