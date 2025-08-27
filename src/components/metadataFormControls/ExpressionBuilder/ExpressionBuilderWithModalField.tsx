import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF, Help } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'
import { StandardFormField } from '../../standardForm'
import { ExpressionBuilderModal } from './ExpressionBuilderModal'
import styles from './ExpressionField.module.css'
import { useExpressionValidator } from './useExpressionValidator'

type ExpressionFieldProps = Readonly<{
    fieldName: string
    modalTitle: string
    editButtonText: string
    validationResource: string
    descriptionFieldName?: string
    helpText?: string
}>

export function ExpressionBuilderWithModalField({
    fieldName,
    modalTitle,
    editButtonText,
    validationResource,
    descriptionFieldName,
    helpText,
}: ExpressionFieldProps) {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)

    const [initialValidate, initialDescription] =
        useExpressionValidator(validationResource)
    const [expressionDescription, setExpressionDescription] = useState<
        string | undefined
    >(undefined)
    const descriptionToShow = expressionDescription ?? initialDescription
    const schemaSection = useSchemaSectionHandleOrThrow()
    const validate = useValidator({ schemaSection, property: fieldName })

    const { input, meta } = useField<string>(fieldName, { validate })

    useEffect(() => {
        if (input.value) {
            initialValidate(input.value)
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.expression}>
                <div className={styles.expressionBox}>
                    {descriptionToShow || i18n.t('(No Value)')}
                </div>
                {meta.touched && meta.error && <Help error>{meta.error}</Help>}
            </div>

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
                    title={modalTitle}
                    onClose={() => setShowExpressionBuilder(false)}
                    dataTest={`formfields-${fieldName}`}
                    validationResource={validationResource}
                    initialValue={input.value}
                    onApply={(expression, expressionDescription) => {
                        input.onChange(expression)
                        input.onBlur()
                        if (expressionDescription !== undefined) {
                            setExpressionDescription(expressionDescription)
                        }
                    }}
                />
            )}

            {descriptionFieldName && (
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        required
                        name={descriptionFieldName}
                        dataTest={`formfields-${descriptionFieldName}`}
                        label={i18n.t('Description (required)')}
                        helpText={helpText}
                    />
                </StandardFormField>
            )}
        </div>
    )
}
