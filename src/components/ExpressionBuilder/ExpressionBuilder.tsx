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
        // the button here does not do anything, but will cause the input to blur (and validate) if clicked
        return (
            <NoticeBox title={i18n.t('Expression not yet validated')}>
                <Button small loading={validating}>
                    {i18n.t('Validate')}
                </Button>
            </NoticeBox>
        )
    }
    if (response?.error) {
        return (
            <NoticeBox warning title={i18n.t('Invalid expression')}>
                <Button small loading={validating}>
                    {i18n.t('Rerun validate')}
                </Button>
            </NoticeBox>
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
                            <div data-test="formfields-expressionBuilder">
                                <div className={styles.expressionField}>
                                    <textarea
                                        ref={expressionRef}
                                        defaultValue={initialValue}
                                        onChange={() => {
                                            setValidationResponse(null)
                                        }}
                                        onBlur={async (e) => {
                                            const currentText =
                                                expressionRef?.current?.value
                                            await hackValidate(
                                                currentText ?? ''
                                            )
                                        }}
                                        aria-describedby="messageTemplate-help"
                                    />
                                </div>
                            </div>
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
                        disabled={
                            !validationResponse ||
                            validationResponse?.error ||
                            validating
                        }
                    >
                        {i18n.t('Apply')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
