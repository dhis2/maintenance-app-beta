import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { DataSetFormValues } from './dataSetFormSchema'
import { HiddenInputField } from './HiddenInputField'
import { PeriodTypeField } from './PeriodTypeField'

export const PeriodsContents = ({
    name,
    formValues,
}: {
    name: string
    formValues: DataSetFormValues
}) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Configure data entry periods')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose for what time periods data can be entered for this data set'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <PeriodTypeField />
            </StandardFormField>
            <StandardFormField>
                <HiddenInputField
                    fieldName="openFuturePeriods"
                    label={i18n.t('Allow data entry for future periods')}
                    uncheckedValue={0}
                    min={'1'}
                />
            </StandardFormField>
            <StandardFormField>
                <HiddenInputField
                    fieldName="expiryDays"
                    label={i18n.t(
                        'Close data entry a certain number of days after period end (expiry days)'
                    )}
                    uncheckedValue={0.0}
                />
            </StandardFormField>
            {formValues?.categoryCombo.id !== DEFAULT_CATEGORY_COMBO.id && (
                <StandardFormField>
                    <HiddenInputField
                        fieldName="openPeriodsAfterCoEndDate"
                        label={i18n.t(
                            `Close data entry after ${formValues?.categoryCombo.displayName.toLowerCase()} category option end date (if category option exist and has end date)`
                        )}
                        uncheckedValue={0.0}
                    />
                </StandardFormField>
            )}
        </SectionedFormSection>
    )
}
