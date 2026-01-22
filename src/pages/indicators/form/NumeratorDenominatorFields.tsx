import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField, ExpressionBuilderEntry } from '../../../components'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import css from './NumeratorDenominatorFields.module.css'

export default function NumeratorDenominatorFields({
    fieldName,
    objectName,
    validationResource,
}: {
    fieldName: string
    objectName: string
    validationResource: string
}) {
    return (
        <div className={css.expressionContainer}>
            <PaddedContainer>
                <div className={css.subtitle}>
                    {objectName
                        ? objectName.charAt(0).toUpperCase() +
                          objectName.slice(1)
                        : ''}
                </div>
                <StandardFormField>
                    <ExpressionBuilderEntry
                        fieldName={fieldName}
                        title={i18n.t('Edit {{objectName}} expression', {
                            objectName,
                        })}
                        editButtonText={i18n.t(
                            'Edit {{objectName}} expression',
                            { objectName }
                        )}
                        setUpButtonText={i18n.t(
                            'Set up {{objectName}} expression',
                            { objectName }
                        )}
                        validationResource={validationResource}
                        type="indicator"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        name={`${fieldName}Description`}
                        dataTest={`formfields-${fieldName}Description`}
                        label={i18n.t('Description')}
                        helpText={i18n.t(
                            'Summarize what this {{objectName}} measures.',
                            { objectName }
                        )}
                    />
                </StandardFormField>
            </PaddedContainer>
        </div>
    )
}
