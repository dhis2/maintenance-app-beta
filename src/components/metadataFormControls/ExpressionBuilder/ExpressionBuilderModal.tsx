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
    TextAreaFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useForm } from 'react-final-form'
import styles from './ExpressionBuilderModal.module.css'

type ExpressionBuilderModalProps = {
    fieldName: string
    title?: string
    required?: boolean
    dataTest?: string
    onClose?: () => void
    onApply?: (value: string, description: string) => void
    validate: (
        value: string | undefined
    ) => string | undefined | Promise<string | undefined>
    expressionDescription: string
    validating: boolean
}

export const ExpressionBuilderModal = ({
    fieldName,
    title,
    required,
    dataTest,
    onClose,
    onApply,
    validate,
    expressionDescription,
    validating,
}: ExpressionBuilderModalProps) => {
    const form = useForm()

    const handleApply = async () => {
        const value = form.getFieldState(fieldName)?.value ?? ''
        const validationResult = await validate(value)

        if (validationResult) {
            form.mutators.setFieldError?.(fieldName, validationResult)
        } else {
            form.mutators.setFieldError?.(fieldName, undefined)
            if (onApply && expressionDescription) {
                onApply(value, expressionDescription)
            }
            onClose?.()
        }
    }

    return (
        <Modal onClose={onClose} large dataTest="expression-builder-modal">
            <ModalTitle>{title}</ModalTitle>

            <ModalContent>
                <div className={styles.container}>
                    <div className={styles.leftPanel}>
                        <FieldRFF<string | undefined>
                            name={fieldName}
                            validate={validate}
                        >
                            {({ input, meta }) => {
                                const isValid =
                                    meta.touched &&
                                    !meta.error &&
                                    input.value &&
                                    expressionDescription

                                return (
                                    <>
                                        <TextAreaFieldFF
                                            dataTest={dataTest}
                                            input={input}
                                            meta={meta}
                                            required={required}
                                            rows={8}
                                            loading={validating}
                                        />
                                        <Box className={styles.noticeBox}>
                                            {input.value &&
                                                expressionDescription &&
                                                !meta.error && (
                                                    <NoticeBox
                                                        valid
                                                        title={
                                                            expressionDescription
                                                        }
                                                    >
                                                        {i18n.t(
                                                            'Valid expression'
                                                        )}
                                                    </NoticeBox>
                                                )}
                                        </Box>

                                        <span className={styles.info}>
                                            <IconInfo16 />{' '}
                                            {i18n.t(
                                                'Add operators, variables, functions, and constants from right sidebar'
                                            )}
                                        </span>

                                        <ModalActions>
                                            <ButtonStrip end>
                                                <Button
                                                    onClick={onClose}
                                                    secondary
                                                >
                                                    {i18n.t('Cancel')}
                                                </Button>
                                                <Button
                                                    onClick={handleApply}
                                                    primary
                                                    dataTest="apply-expression-button"
                                                    disabled={
                                                        !isValid ||
                                                        validating ||
                                                        meta.active
                                                    }
                                                >
                                                    {i18n.t('Apply')}
                                                </Button>
                                            </ButtonStrip>
                                        </ModalActions>
                                    </>
                                )
                            }}
                        </FieldRFF>
                    </div>

                    <div className={styles.rightPanel}>
                        {/* Right side accordion content can be added here */}
                    </div>
                </div>
            </ModalContent>
        </Modal>
    )
}
