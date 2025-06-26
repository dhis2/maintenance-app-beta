import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CodeField,
    ModelTransferField,
    NameField,
    StandardFormField,
} from '../../../components'
import { SchemaSection } from '../../../lib'

type BasicInformationSectionProps = {
    section: SchemaSection
}

export const BasicInformationSection: React.FC<
    BasicInformationSectionProps
> = ({ section }) => (
    <>
        <StandardFormField>
            <NameField schemaSection={section} />
        </StandardFormField>
        <StandardFormField>
            <CodeField schemaSection={section} />
        </StandardFormField>
        <StandardFormField>
            <ModelTransferField
                name="dataSets"
                query={{ resource: 'dataSets' }}
                label={i18n.t(
                    'Choose which data sets to send this notification for'
                )}
                leftHeader={i18n.t('Available Data Sets')}
                rightHeader={i18n.t('Selected Data Sets')}
                filterPlaceholder={i18n.t('Search data sets...')}
                filterPlaceholderPicked={i18n.t('Filter selected data sets...')}
            />
        </StandardFormField>
    </>
)
