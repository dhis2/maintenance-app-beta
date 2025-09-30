import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'

export default function NumeratorFields() {
    return (
        <PaddedContainer>
            <ExpressionBuilderWithModalField
                fieldName="numerator"
                modalTitle={i18n.t('Numerator Expression')}
                editButtonText={i18n.t('Edit numerator expression')}
                validationResource="indicators/expression/description"
            />
            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name="numeratorDescription"
                    dataTest={`formfields-numeratorDescription`}
                    label={i18n.t('Description (required)')}
                    helpText={i18n.t(
                        'Summarise what this numerator expression measures.'
                    )}
                />
            </StandardFormField>
        </PaddedContainer>
    )
}
