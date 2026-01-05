import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'
import { getConstantTranslation, SchemaName, useSchema } from '../../../lib'
import css from './PredictorFormFields.module.css'

export const ExpressionFields = ({
    fieldName,
    expressionName,
    expressionLabel,
    expressionEditText,
    validationResource,
    showMissingValueStrategy,
}: {
    fieldName: string
    expressionName: string
    expressionLabel: string
    expressionEditText: string
    validationResource: string
    showMissingValueStrategy: boolean
}) => {
    const expressionSchema = useSchema('expression' as SchemaName)
    return (
        <div className={css.paddedContainerContainer}>
            <PaddedContainer>
                <div className={css.subtitle}>{expressionName}</div>
                <ExpressionBuilderWithModalField
                    fieldName={`${fieldName}.expression`}
                    modalTitle={expressionLabel}
                    editButtonText={expressionEditText}
                    validationResource={validationResource}
                />
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        name={`${fieldName}.description`}
                        dataTest={`formfields-denominatorDescription`}
                        label={i18n.t('Description')}
                        helpText={i18n.t(
                            'Summarize what this {{metadataObjectName}} measures.',
                            { metadataObjectName: expressionName.toLowerCase() }
                        )}
                    />
                </StandardFormField>
                {showMissingValueStrategy && (
                    <StandardFormField>
                        <FieldRFF
                            component={SingleSelectFieldFF}
                            inputWidth="400px"
                            clearable
                            name={`${fieldName}.missingValueStrategy`}
                            label={i18n.t('Missing value strategy')}
                            options={expressionSchema?.properties?.missingValueStrategy?.constants?.map(
                                (opt) => ({
                                    value: opt,
                                    label: getConstantTranslation(opt),
                                })
                            )}
                        />
                    </StandardFormField>
                )}
            </PaddedContainer>
        </div>
    )
}
