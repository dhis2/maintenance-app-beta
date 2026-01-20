import i18n from '@dhis2/d2-i18n'
import {
    InputFieldFF,
    composeValidators,
    createMinNumber,
    number,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function MinDaysFromStartField() {
    const validator = useMemo(
        () =>
            composeValidators(
                (value: unknown) => {
                    if (value === undefined || value === null || value === '') {
                        return i18n.t('Required')
                    }
                    return undefined
                },
                number,
                createMinNumber(0)
            ),
        []
    )

    return (
        <FieldRFF
            name="minDaysFromStart"
            component={InputFieldFF}
            type="number"
            inputWidth="200px"
            min="0"
            required
            label={i18n.t('Scheduled days from start (required)')}
            dataTest="formfields-minDaysFromStart"
            validate={validator}
            validateFields={[]}
            format={(value: unknown) => value?.toString() ?? '0'}
            parse={(value: unknown) => value?.toString() ?? '0'}
            helpText={i18n.t(
                'Days to add to the enrollment or incident date. 0 means same day.'
            )}
        />
    )
}
