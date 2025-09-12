import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'

export default function DenominatorFields() {
    return (
        <PaddedContainer>
            <ExpressionBuilderWithModalField
                fieldName="denominator"
                modalTitle={i18n.t('Denominator Expression')}
                editButtonText={i18n.t('Edit denominator expression')}
                validationResource="indicators/expression/description"
            />
            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name="denominatorDescription"
                    dataTest={`formfields-denominatorDescription`}
                    label={i18n.t('Description (required)')}
                    helpText={i18n.t(
                        'Summarise what this denominator expression measures.'
                    )}
                />
            </StandardFormField>
        </PaddedContainer>
    )
}
