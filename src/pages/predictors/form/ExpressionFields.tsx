import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    StandardFormField,
    ExpressionBuilderEntry,
    MissingValueStrategyField,
} from '../../../components'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'
import { SchemaName, SchemaSection } from '../../../lib'
import css from './PredictorFormFields.module.css'

const expressionSchemaSection = {
    name: 'expression' as SchemaName,
    namePlural: 'expressions',
} as SchemaSection

export const ExpressionFields = ({
    fieldName,
    objectName,
    validationResource,
    showMissingValueStrategy,
    clearable = false,
}: {
    fieldName: string
    objectName: string
    validationResource: string
    showMissingValueStrategy: boolean
    clearable?: boolean
}) => {
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
                        fieldName={`${fieldName}.expression`}
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
                        validateSchemaSection={expressionSchemaSection}
                        validateProperty="expression"
                        clearable={clearable}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        name={`${fieldName}.description`}
                        dataTest={`formfields-denominatorDescription`}
                        label={i18n.t('Description')}
                        helpText={i18n.t(
                            'Summarize what this {{objectName}} measures.',
                            { objectName }
                        )}
                        // required={true}
                    />
                </StandardFormField>
                {showMissingValueStrategy && (
                    <StandardFormField>
                        <MissingValueStrategyField objectName="generator" />
                    </StandardFormField>
                )}
            </PaddedContainer>
        </div>
    )
}
