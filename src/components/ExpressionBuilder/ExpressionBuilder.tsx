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
import React, { useCallback, useRef, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../standardForm'
import styles from './ExpressionBuilder.module.css'
import { useExpressionValidator } from './useExpressionValidator'
import { VariableSelectionBox } from './VariableSelectionBox'
// import { useExpressionValidator } from '../metadataFormControls/ExpressionBuilder/useExpressionValidator'

const ValidationBox = ({
    response,
    validating,
}: {
    response: any
    validating: boolean
}) => {
    if (!response || validating) {
        return null
    }
    if (response?.error) {
        return (
            <NoticeBox warning title={i18n.t('Invalid expression')}></NoticeBox>
        )
    }
    return (
        <NoticeBox valid title={i18n.t('Valid expression')}>
            <div>{response?.expressionDescription}</div>
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

    const [validate, validating] = useExpressionValidator(validationResource)
    const [validationResponse, setValidationResponse] = useState<any>(null)

    const hackValidate = useCallback(async (validationString: string) => {
        if (validationString.trim() === '') {
            setValidationResponse(null)
            return
        }
        const result = await validate(validationString)
        setValidationResponse(result)
    }, [])

    return (
        <Modal onClose={onClose} large dataTest="expression-builder-modal">
            <ModalTitle>{title}</ModalTitle>

            <ModalContent>
                <div className={styles.expressionBuilderContentContainer}>
                    <div className={styles.expressionBuilderEntryContainer}>
                        <StandardFormField>
                            <FieldRFF name={fieldName}>
                                {({ input }) => {
                                    return (
                                        <div data-test="formfields-expressionBuilder">
                                            <div
                                                className={
                                                    styles.expressionField
                                                }
                                            >
                                                <textarea
                                                    ref={expressionRef}
                                                    defaultValue={initialValue}
                                                    onBlur={async (e) => {
                                                        const currentText =
                                                            expressionRef
                                                                ?.current?.value
                                                        input.onChange(
                                                            currentText
                                                        )
                                                        await hackValidate(
                                                            currentText ?? ''
                                                        )
                                                    }}
                                                    aria-describedby="messageTemplate-help"
                                                />
                                            </div>
                                        </div>
                                    )
                                }}
                            </FieldRFF>
                        </StandardFormField>
                        <ValidationBox
                            response={validationResponse}
                            validating={validating}
                        />
                        <div className={styles.fieldHelpText}>
                            <IconInfo16 />
                            <div id="messageTemplate-help">
                                {i18n.t(
                                    'Add operators, variables, functions, and constants from the right sidebar'
                                )}
                            </div>
                        </div>
                    </div>
                    <VariableSelectionBox
                        elementRef={expressionRef}
                        input={expressionInput}
                        validate={hackValidate}
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
                        onClick={() => {
                            expressionInput.onChange(
                                expressionRef?.current?.value ?? ''
                            )
                            onClose?.()
                        }}
                        primary
                        dataTest="apply-expression-button"
                        disabled={validationResponse?.error || validating}
                    >
                        {i18n.t('Apply')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
