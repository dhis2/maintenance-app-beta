import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import { SchemaName } from '../../../types'

export function PatternField() {
    const validate = useCheckMaxLengthFromSchema(
        SchemaName.trackedEntityAttribute,
        'pattern'
    )

    return (
        <FieldRFF
            component={InputFieldFF}
            inputWidth="600px"
            dataTest="formfields-pattern"
            name="pattern"
            label={i18n.t('Pattern for automatically generated values')}
            placeholder={i18n.t(
                'e.g. ORG_UNIT_CODE(...) + "-" + CURRENT_DATE(yyyyww) + "-" + SEQUENTIAL(#####)'
            )}
            helpText={i18n.t('Pattern must use the DHIS2 TextPattern syntax.')}
            validateFields={[]}
            validate={validate}
        />
    )
}
