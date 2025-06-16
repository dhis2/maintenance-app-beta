import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'
import { WhatToSendSection } from './WhatToSendSection'
import { WhenToSendSection } from './WhenToSendSection'
import { WhoToSendSection } from './WhoToSendSection'

export const DataSetNotificationsFormFields = () => {
    const section = SECTIONS_MAP.dataSetNotificationTemplate
    return (
        <div>
            <SectionedFormSections>
                <SectionedFormSection name="whatToSend">
                    <StandardFormSectionTitle>
                        {i18n.t('What to send')}
                    </StandardFormSectionTitle>
                    <WhatToSendSection section={section} />
                </SectionedFormSection>
                <SectionedFormSection name="whenToSend">
                    <StandardFormSectionTitle>
                        {i18n.t('When to send it')}
                    </StandardFormSectionTitle>
                    <WhenToSendSection />
                </SectionedFormSection>
                <SectionedFormSection name="whoToSend">
                    <StandardFormSectionTitle>
                        {i18n.t('Who to send it to')}
                    </StandardFormSectionTitle>
                    <WhoToSendSection />
                </SectionedFormSection>
            </SectionedFormSections>
        </div>
    )
}
