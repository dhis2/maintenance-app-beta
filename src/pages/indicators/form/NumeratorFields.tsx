import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderModal } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderModal'
import { useExpressionValidator } from '../../../components/metadataFormControls/ExpressionBuilder/useExpressionValidator'
import styles from './EpressionFields.module.css'

function NumeratorFields() {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)
    const [expressionDescription, setExpressionDescription] = useState<
        string | null
    >(null)

    const numerator = useField<string>('numerator')
    const numeratorValue = numerator.input.value

    const [validate, description] = useExpressionValidator(
        'indicators/expression/description'
    )

    useEffect(() => {
        const runValidation = async () => {
            if (numeratorValue) {
                setExpressionDescription(description)
            } else {
                setExpressionDescription(null)
            }
        }

        runValidation()
    }, [numeratorValue, validate, description])

    const handleExpressionApply = (value: string, desc: string) => {
        numerator.input.onChange(value)
        setExpressionDescription(desc)
    }

    return (
        <div className={styles.container}>
            {expressionDescription && (
                <div className={styles.expressionBox}>
                    {expressionDescription}
                </div>
            )}

            <div className={styles.buttonWrapper}>
                <Button
                    small
                    secondary
                    onClick={() => setShowExpressionBuilder(true)}
                    dataTest="edit-numerator-expression-button"
                >
                    {i18n.t('Edit numerator expression')}
                </Button>
            </div>

            {showExpressionBuilder && (
                <ExpressionBuilderModal
                    fieldName="numerator"
                    title="Numerator Expression"
                    validationResource="indicators/expression/description"
                    onClose={() => setShowExpressionBuilder(false)}
                    onApply={handleExpressionApply}
                />
            )}

            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name="numeratorDescription"
                    dataTest="formfields-numeratorDescription"
                    label={i18n.t('Description (required)')}
                    helpText={i18n.t('Help text, where is this used?')}
                />
            </StandardFormField>
        </div>
    )
}

export default NumeratorFields
