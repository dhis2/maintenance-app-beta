import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Button,
    ButtonStrip,
    IconInfo16,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
    TextAreaField,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { FieldRenderProps, useField } from 'react-final-form'
import styles from './ExpressionBuilderModal.module.css'
import { useExpressionValidator } from './useExpressionValidator'

type ExpressionBuilderModalProps = {
    title?: string
    required?: boolean
    dataTest?: string
    onClose?: () => void
    validationResource: string
    initialValue?: string
    onApply: (expression?: string, expressionDescription?: string) => void
}

export const ExpressionBuilderModal = ({
    title,
    required,
    dataTest,
    onClose,
    validationResource,
    initialValue,
    onApply,
}: ExpressionBuilderModalProps) => {
    const [expression, setExpression] = useState(initialValue)
    const [expressionIsOnFocus, setExpressionIsOnFocus] = useState(false)
    const [validationError, setValidationError] = useState<string | undefined>(
        undefined
    )
    const [validate, expressionDescription, validating] =
        useExpressionValidator(validationResource)
    const isValid = validationError === undefined

    return (
        <Modal onClose={onClose} large dataTest="expression-builder-modal">
            <ModalTitle>{title}</ModalTitle>

            <ModalContent>
                <div className={styles.container}>
                    <div className={styles.leftPanel}>
                        <>
                            <TextAreaField
                                dataTest={dataTest}
                                value={expression}
                                required={required}
                                error={!!validationError}
                                validationText={validationError}
                                rows={8}
                                loading={validating}
                                onBlur={async (payload) => {
                                    setExpressionIsOnFocus(false)
                                    const maybeValidationError = await validate(
                                        payload.value
                                    )
                                    setValidationError(maybeValidationError)
                                }}
                                onFocus={() => setExpressionIsOnFocus(true)}
                                onChange={(payload) =>
                                    setExpression(payload.value)
                                }
                            />
                            <Box className={styles.noticeBox}>
                                {isValid &&
                                    !validating &&
                                    !expressionIsOnFocus &&
                                    expressionDescription && (
                                        <NoticeBox
                                            valid
                                            title={expressionDescription}
                                        >
                                            {i18n.t('Valid expression')}
                                        </NoticeBox>
                                    )}
                            </Box>

                            <span className={styles.info}>
                                <IconInfo16 />
                                {i18n.t(
                                    'Add operators, variables, functions, and constants from right sidebar'
                                )}
                            </span>
                        </>
                    </div>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            onApply(expression, expressionDescription)
                            onClose?.()
                        }}
                        primary
                        dataTest="apply-expression-button"
                        disabled={!isValid || validating || expressionIsOnFocus}
                    >
                        {i18n.t('Apply')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
