import i18n from '@dhis2/d2-i18n'
import { TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useCheckMaxLengthFromSchema } from '../../../lib'
import type { SchemaName } from '../../../types'

export function DescriptionField() {
    const validate = useCheckMaxLengthFromSchema(
        'dataElement' as SchemaName,
        'formName'
    )

    return (
        <FieldRFF
            component={TextAreaFieldFF}
            dataTest="dataelementsformfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description')}
            helpText={i18n.t(
                "Explain the purpose of this data element and how it's measured."
            )}
            validate={validate}
            validateFields={[]}
        />
    )
}
