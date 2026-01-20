import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useValidator } from '../../../../../lib/models/useFieldValidators'
import { stageSchemaSection } from '../StageForm'

export function EventLabelField() {
    const validator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'eventLabel',
    })

    return (
        <FieldRFF
            component={InputFieldFF}
            name="eventLabel"
            inputWidth="400px"
            label={i18n.t('Custom label for event')}
            dataTest="formfields-eventLabel"
            validate={validator}
        />
    )
}
