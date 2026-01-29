import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { DataInputPeriodsSelector } from './dataInputPeriods/DataInputPeriodsSelector'
import { PeriodTypeField } from './PeriodTypeField'
import { ToggledNumberInput } from './ToggledNumberInput'

export const PeriodsContents = React.memo(function PeriodsContents({
    name,
}: {
    name: string
}) {
    const formValues = useFormState({ subscription: { values: true } }).values
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
                <ToggledNumberInput
                    name="openFuturePeriods"
                    label={i18n.t('Allow data entry for future periods')}
                    uncheckedValue={0}
                    min={'1'}
                />
            </StandardFormField>
            <StandardFormField>
                <ToggledNumberInput
                    name="expiryDays"
                    label={i18n.t(
                        'Close data entry a certain number of days after period end (expiry days)'
                    )}
                    uncheckedValue={0}
                    min={'1'}
                />
            </StandardFormField>
            {formValues?.categoryCombo.id !== DEFAULT_CATEGORY_COMBO.id && (
                <StandardFormField>
                    <ToggledNumberInput
                        name="openPeriodsAfterCoEndDate"
                        label={i18n.t(
                            'Close data entry after "{{categoryComboName}}" category option end date (if category option exist and has end date)',
                            {
                                categoryComboName:
                                    formValues?.categoryCombo.displayName,
                            }
                        )}
                        uncheckedValue={0.0}
                    />
                </StandardFormField>
            )}
            <StandardFormSectionTitle>
                {i18n.t('Limit data entry by period')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Optionally configure when data can be entered for certain periods'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <DataInputPeriodsSelector />
            </StandardFormField>
        </SectionedFormSection>
    )
})
