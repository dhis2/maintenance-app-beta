import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useValidator } from '../../../../../lib/models/useFieldValidators'
import { stageSchemaSection } from '../StageForm'

export function ProgramStageLabelField() {
    const validator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'programStageLabel',
    })

    return (
        <FieldRFF
            component={InputFieldFF}
            name="programStageLabel"
            inputWidth="400px"
            label={i18n.t('Custom label for program stage')}
            dataTest="formfields-programStageLabel"
            validate={validator}
            validateFields={[]}
        />
    )
}
