import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function PreGenerateUidField() {
    return (
        <FieldRFF
            name="preGenerateUid"
            type="checkbox"
            component={CheckboxFieldFF}
            label={i18n.t('Pre-generate event UID')}
            dataTest="formfields-preGenerateUid"
            validateFields={[]}
        />
    )
}
