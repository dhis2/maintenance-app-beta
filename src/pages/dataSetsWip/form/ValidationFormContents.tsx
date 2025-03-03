import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { CompulsoryDataElementsTransfer } from './CompulsoryDataElementsTransfer'
import { DataApprovalWorkflowField } from './DataApprovalWorkflowField'
import { TimelyDaysField } from './TimelyDaysField'

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
            <StandardFormField>
                <DataApprovalWorkflowField />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="validCompleteOnly"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        'Completing a data set requires passing validation'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="noValueRequiresComment"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        'Completing a data set requires all empty values to have a comment'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="compulsoryFieldsCompleteOnly"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        'Completing a data set requires compulsory field to have a value'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="fieldCombinationRequired"
                    type="checkbox"
                    component={CheckboxFieldFF}
                    label={i18n.t(
                        'Data elements with category combinations require all fields to have a value if one has a value'
                    )}
                />
            </StandardFormField>
            <StandardFormField>
                <TimelyDaysField />
            </StandardFormField>

            <StandardFormSectionTitle>
                {i18n.t('Compulsory data entry')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Optionally configure which data elements must have a value to complete this data set.'
                )}
            </StandardFormSectionDescription>
            <CompulsoryDataElementsTransfer />
        </SectionedFormSection>
    )
}
