import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'

export const ValidationFormContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Validation and limitations')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Configure how data can and must be entered for this data'
                )}
            </StandardFormSectionDescription>
            {/* <StandardFormField>
                <ModelTransferField
                    name={'dataElements'}
                    query={{
                        resource: 'dataElements',
                    }}
                />
            </StandardFormField> */}
        </SectionedFormSection>
    )
}
