import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    IconInfo16,
    NoticeBox,
    Modal,
    ModalContent,
    ModalTitle,
    ModalActions,
} from '@dhis2/ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import { StandardFormField } from '../standardForm'
import styles from './ExpressionBuilder.module.css'
import {
    useExpressionValidator,
    ValidationResult,
} from './useExpressionValidator'
import { VariableSelectionBox } from './VariableSelectionBox'
// import { useExpressionValidator } from '../metadataFormControls/ExpressionBuilder/useExpressionValidator'

const ValidationBox = ({
    response,
    validating,
    validatedValue,
    validate,
    isEmpty,
}: {
    response: ValidationResult | null
    validating: boolean
    isEmpty: boolean
    validatedValue: string | null
    validate: () => void
}) => {
    if (isEmpty) {
        return (
            <NoticeBox
                error
                title={i18n.t('Expression cannot be empty')}
            ></NoticeBox>
        )
    }
    if (!response || validating) {
        // the button here does not do anything, but will cause the input to blur (and validate) if clicked
        return (
            <NoticeBox title={i18n.t('Expression not yet validated')}>
                <Button
                    disabled={validating}
                    small
                    loading={validating}
                    onClick={validate}
                >
                    {i18n.t('Validate')}
                </Button>
            </NoticeBox>
        )
    }
    if (response?.error) {
        return (
            <NoticeBox warning title={i18n.t('Invalid expression')}>
                <p>{validatedValue}</p>
            </NoticeBox>
        )
    }
    return (
        <NoticeBox valid title={i18n.t('Valid expression')}>
            <div style={{ whiteSpace: 'pre-line' }}>
                {response?.expressionDescription}
            </div>
        </NoticeBox>
    )
}

export const ExpressionBuilder = ({
    fieldName,
    validationResource,
    onClose,
    title,
    initialValue,
}: {
    fieldName: string
    validationResource: string
    onClose: () => void
    title: string
    initialValue: string
}) => {
    const { input: expressionInput } = useField(fieldName)
    const expressionRef = useRef<HTMLTextAreaElement>(null)

    const [validate, validating, validatedValue] =
        useExpressionValidator(validationResource)
    const [validationResponse, setValidationResponse] =
        useState<ValidationResult | null>(null)
    const [isEmpty, setIsEmpty] = useState<boolean>(false)
    const [initiallyValidated, setInitiallyValidated] = useState<boolean>(false)

    const validateCurrentState = useCallback(async () => {
        const currentText = expressionRef?.current?.value
        if (currentText === '') {
            setIsEmpty(true)
            return false
        }
        setIsEmpty(false)
        const result = await validate(currentText)
        setValidationResponse(result ?? null)
        return !result?.error
    }, [validate])

    const clearValidationState = useCallback(() => {
        setIsEmpty(false)
        setValidationResponse(null)
    }, [setIsEmpty, setValidationResponse])

    const performInitialValidation = useCallback(
        async (s: string) => {
            if (
                !validate ||
                !setValidationResponse ||
                !setIsEmpty ||
                !setInitiallyValidated
            ) {
                return
            }
            if (s.trim() === '') {
                setIsEmpty(true)
            } else {
                const result = await validate(s)
                setValidationResponse(result ?? null)
            }
            setInitiallyValidated(true)
        },
        [setIsEmpty, setValidationResponse, setInitiallyValidated, validate]
    )

    useEffect(() => {
        performInitialValidation(initialValue)
    }, [initialValue, performInitialValidation])

    return (
        <Modal onClose={onClose} fluid dataTest="expression-builder-modal">
            <div className={styles.expressionBuilderModalDimensions}>
                <ModalTitle>{title}</ModalTitle>

                <ModalContent>
                    <div className={styles.expressionBuilderContentContainer}>
                        <div className={styles.expressionBuilderEntryContainer}>
                            <div className={styles.expressionField}>
                                <StandardFormField>
                                    <textarea
                                        ref={expressionRef}
                                        defaultValue={initialValue}
                                        onChange={(e) => {
                                            if (
                                                e?.target?.value.trim() === ''
                                            ) {
                                                setIsEmpty(true)
                                            } else {
                                                setValidationResponse(null)
                                                setIsEmpty(false)
                                            }
                                        }}
                                        aria-describedby="messageTemplate-help"
                                    />
                                </StandardFormField>
                            </div>
                            <div>
                                {initiallyValidated && (
                                    <ValidationBox
                                        response={validationResponse}
                                        validating={validating}
                                        validatedValue={validatedValue}
                                        validate={validateCurrentState}
                                        isEmpty={isEmpty}
                                    />
                                )}

                                <div className={styles.fieldHelpText}>
                                    <IconInfo16 />
                                    <div id="messageTemplate-help">
                                        {i18n.t(
                                            'Add operators, variables, functions, and constants from the right sidebar'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <VariableSelectionBox
                            elementRef={expressionRef}
                            clearValidationState={clearValidationState}
                        />
                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button
                            onClick={onClose}
                            secondary
                            dataTest="cancel-expression-button"
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                let proceed = validationResponse !== null
                                if (validationResponse === null || isEmpty) {
                                    proceed = await validateCurrentState()
                                }
                                if (proceed) {
                                    expressionInput.onChange(
                                        expressionRef?.current?.value ?? ''
                                    )
                                    expressionInput.onBlur()
                                    onClose?.()
                                } else {
                                    // if invalid, the ValidationBox will display warning
                                    return
                                }
                            }}
                            primary
                            dataTest="apply-expression-button"
                            disabled={
                                validating ||
                                isEmpty ||
                                !initiallyValidated ||
                                !!validationResponse?.error
                            }
                        >
                            {i18n.t('Apply')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </div>
        </Modal>
    )
}
