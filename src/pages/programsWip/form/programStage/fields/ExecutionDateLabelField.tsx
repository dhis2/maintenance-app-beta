import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useValidator } from '../../../../../lib/models/useFieldValidators'
import { stageSchemaSection } from '../StageForm'

export function ExecutionDateLabelField() {
    const validator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'executionDateLabel',
    })

    return (
        <FieldRFF
            component={InputFieldFF}
            name="executionDateLabel"
            inputWidth="400px"
            label={i18n.t('Custom label for report date')}
            dataTest="formfields-executionDateLabel"
            validate={validator}
            validateFields={[]}
        />
    )
}
