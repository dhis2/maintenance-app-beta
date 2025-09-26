import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { ConfirmationModalWrapper } from '../../../components'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'

export function PeriodTypeField() {
    const { input, meta } = useField('periodType')

    const renderComponent = ({
        onChange,
    }: {
        onChange: (event: any) => void
    }) => (
        <PeriodTypeSelect
            selected={input.value}
            invalid={meta.touched && !!meta.error}
            onChange={onChange}
        />
    )
    return (
        <Field
            required
            name="periodType"
            label={i18n.t('Period type')}
            error={meta.touched && !!meta.error}
            validationText={meta.touched ? meta.error : undefined}
        >
            <ConfirmationModalWrapper
                onChange={input.onChange}
                renderComponent={renderComponent}
                modalTitle={i18n.t('Change period type')}
                modalMessage={i18n.t(
                    'Changing the period type will make previously entered data for this data set not appear in the data entry app. This can lead to duplicate data entry.'
                )}
                modalMessageSelectionSpecificConfirmation={(selection) =>
                    i18n.t(
                        'Are you sure you want to change the {{objectType}} to {{newObjectTypeValue}}?',
                        {
                            objectType: i18n.t('period type'),
                            newObjectTypeValue: selection,
                        }
                    )
                }
            />
        </Field>
    )
}
