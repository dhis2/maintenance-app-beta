import i18n from '@dhis2/d2-i18n'
import { Button, Label, TextAreaFieldFF } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useField } from 'react-final-form'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'
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
}: ExpressionFieldProps) {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)

    const [initialExpressionValidation, initialExpressionDescription] =
        useExpressionValidator(validationResource)
    const [expressionDescription, setExpressionDescription] = useState<
        string | undefined
    >(undefined)
    const descriptionToShow =
        expressionDescription ?? initialExpressionDescription
    const schemaSection = useSchemaSectionHandleOrThrow()
    const schemaValidate = useValidator({ schemaSection, property: fieldName })
    const { input, meta } = useField<string>(fieldName, {
        validate: schemaValidate,
    })

    useEffect(() => {
        if (input.value) {
            initialExpressionValidation(input.value)
        }
    })

    return (
        <div>
            <div className={styles.expression}>
                <div
                    className={styles.expressionBox}
                    data-test={`${fieldName}-expression-description`}
                >
                    {descriptionToShow || i18n.t('(No Value)')}
                </div>
                <TextAreaFieldFF
                    dataTest={`formfields-${fieldName}`}
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    disabled
                    className={styles.expressionHiddenInput}
                />
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
        </div>
    )
}
