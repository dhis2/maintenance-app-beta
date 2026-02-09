import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { StandardFormField } from '../../../../../components'
import { ExpressionField, LocationField } from '../../../fields'

export function displayTextFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <LocationField required />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="content"
                    label={i18n.t('Static text')}
                    component={InputFieldFF}
                    required
                />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t(
                        'Expression to evaluate and display after static text.'
                    )}
                />
            </StandardFormField>
        </>
    )
}
