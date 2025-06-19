import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CodeField,
    ModelTransferField,
    NameField,
    StandardFormField,
} from '../../../components'
import { SchemaSection } from '../../../lib'
import { MessageTemplateField, SubjectTemplateField } from './TemplateFields'

type WhatToSendSectionProps = {
    section: SchemaSection
}

export const WhatToSendSection: React.FC<WhatToSendSectionProps> = ({
    section,
}) => {
    return (
        <div>
            <StandardFormField>
                <NameField schemaSection={section} />
            </StandardFormField>
            <StandardFormField>
                <CodeField schemaSection={section} />
            </StandardFormField>
            <StandardFormField>
                <ModelTransferField
                    name="dataSets"
                    query={{
                        resource: 'dataSets',
                    }}
                    label={i18n.t('Select Data Sets')}
                    leftHeader={i18n.t('Available Data Sets')}
                    rightHeader={i18n.t('Selected Data Sets')}
                    filterPlaceholder={i18n.t('Search data sets...')}
                    filterPlaceholderPicked={i18n.t(
                        'Filter selected data sets...'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <SubjectTemplateField schemaSection={section} />
            </StandardFormField>
            <StandardFormField>
                <MessageTemplateField schemaSection={section} />
            </StandardFormField>
        </div>
    )
}
