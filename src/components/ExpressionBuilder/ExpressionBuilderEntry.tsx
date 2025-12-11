import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useField } from 'react-final-form'
// import { useSchemaSectionHandleOrThrow } from '../../lib'
// import { useValidator } from '../../lib/models/useFieldValidators'
import { useParams } from 'react-router-dom'
import { ExpressionBuilder } from './ExpressionBuilder'
import styles from './ExpressionBuilder.module.css'
import { useExpressionValidator } from './useExpressionValidator'

type ExpressionBuilderEntryProps = Readonly<{
    fieldName: string
    title: string
    editButtonText: string
    setUpButtonText: string
    validationResource: string
    descriptionFieldName?: string
    helpText?: string
}>

export const ExpressionBuilderEntry = ({
    fieldName,
    title,
    editButtonText,
    setUpButtonText,
    validationResource,
}: ExpressionBuilderEntryProps) => {
    const [showExpressionBuilder, setShowExpressionBuilder] = useState(false)

    const [initialExpressionValidation] =
        useExpressionValidator(validationResource)
    const [expressionDescription, setExpressionDescription] = useState<
        string | undefined
    >(undefined)
    const descriptionToShow = expressionDescription
    // const schemaSection = useSchemaSectionHandleOrThrow()
    // const schemaValidate = useValidator({ schemaSection, property: fieldName })
    const params = useParams()
    const isEdit = !!params?.id

    const schemaValidate = () => {}
    const { input } = useField<string>(fieldName, {
        validate: schemaValidate,
    })

    useEffect(() => {
        const performInitialValidation = async () => {
            if (input.value && initialExpressionValidation !== undefined) {
                const initialValidation = await initialExpressionValidation(
                    input.value
                )
                setExpressionDescription(
                    initialValidation?.expressionDescription
                )
            }
        }
        performInitialValidation()
    }, [input.value, initialExpressionValidation])

    return (
        <div>
            <div className={styles.expression}>
                {(isEdit || descriptionToShow) && (
                    <div
                        className={styles.expressionBox}
                        data-test={`${fieldName}-expression-description`}
                    >
                        {descriptionToShow || i18n.t('(No Value)')}
                    </div>
                )}
            </div>

            <div className={styles.buttonWrapper}>
                <Button
                    small
                    secondary
                    onClick={() => setShowExpressionBuilder(true)}
                    dataTest={`edit-${fieldName}-expression-button`}
                >
                    {isEdit || descriptionToShow
                        ? editButtonText
                        : setUpButtonText}
                </Button>
            </div>

            {showExpressionBuilder && (
                <ExpressionBuilder
                    title={title}
                    onClose={() => setShowExpressionBuilder(false)}
                    initialValue={input.value}
                    fieldName={fieldName}
                    validationResource={validationResource}
                />
            )}
        </div>
    )
}
