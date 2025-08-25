import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../standardForm'
import { ExpressionBuilderModal } from './ExpressionBuilderModal'
import styles from './ExpressionField.module.css'
import { useExpressionValidator } from './useExpressionValidator'

type ExpressionFieldProps = Readonly<{
    fieldName: string
    descriptionFieldName: string
    modalTitle: string
    editButtonText: string
    validationResource: string
}>

export function ExpressionField({
    fieldName,
    descriptionFieldName,
    modalTitle,
    editButtonText,
    validationResource,
}: ExpressionFieldProps) {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)

    const field = useField<string>(fieldName, { subscription: { value: true } })
    const fieldValue = field.input.value
    const [validate, expressionDescription, validating] =
        useExpressionValidator(validationResource)

    useEffect(() => {
        if (fieldValue) {
            validate(fieldValue)
        }
    }, [fieldValue, validate])

    const handleExpressionApply = (value: string, desc: string) => {
        field.input.onChange(value)
        if (!desc) {
            validate(value)
        }
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
                    dataTest={`edit-${fieldName}-expression-button`}
                >
                    {editButtonText}
                </Button>
            </div>

            {showExpressionBuilder && (
                <ExpressionBuilderModal
                    fieldName={fieldName}
                    title={modalTitle}
                    onClose={() => setShowExpressionBuilder(false)}
                    onApply={handleExpressionApply}
                    dataTest={`formfields-${fieldName}`}
                    validate={validate}
                    expressionDescription={expressionDescription ?? ''}
                    validating={validating}
                />
            )}

            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name={descriptionFieldName}
                    dataTest={`formfields-${descriptionFieldName}`}
                    label={i18n.t('Description (required)')}
                    helpText={i18n.t('Help text, where is this used?')}
                />
            </StandardFormField>
        </div>
    )
}
