import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderModal } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderModal'
import { useExpressionValidator } from '../../../components/metadataFormControls/ExpressionBuilder/useExpressionValidator'
import styles from './EpressionFields.module.css'

function DenominatorFields() {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)
    const [expressionDescription, setExpressionDescription] = useState<
        string | null
    >(null)

    const denominator = useField<string>('denominator')
    const denominatorValue = denominator.input.value

    const [validate, description] = useExpressionValidator(
        'indicators/expression/description'
    )

    useEffect(() => {
        const runValidation = async () => {
            if (denominatorValue) {
                setExpressionDescription(description)
            } else {
                setExpressionDescription(null)
            }
        }

        runValidation()
    }, [denominatorValue, validate, description])

    const handleExpressionApply = (value: string, desc: string) => {
        denominator.input.onChange(value)
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
                    dataTest="edit-denominator-expression-button"
                >
                    {i18n.t('Edit denominator expression')}
                </Button>
            </div>

            {showExpressionBuilder && (
                <ExpressionBuilderModal
                    fieldName="denominator"
                    title="Denominator Expression"
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
                    name="denominatorDescription"
                    dataTest="formfields-denominatorDescription"
                    label={i18n.t('Description (required)')}
                    helpText={i18n.t('Help text, where is this used?')}
                />
            </StandardFormField>
        </div>
    )
}

export default DenominatorFields
