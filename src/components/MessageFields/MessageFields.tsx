import i18n from '@dhis2/d2-i18n'
import { Button, IconErrorFilled24, theme } from '@dhis2/ui'
import React, { useRef, useState, RefObject } from 'react'
import { Field as FieldRFF, useField, FieldInputProps } from 'react-final-form'
import { StandardFormField } from '../standardForm'
import styles from './MessageFields.module.css'

const insertElement = ({
    id,
    elementRef,
    input,
}: {
    id: string
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
}) => {
    if (elementRef.current) {
        const elementText = `V{${id}}`

        const cursorStartIndex = elementRef.current?.selectionStart ?? 0
        const startText = elementRef.current?.value.slice(0, cursorStartIndex)
        const endText = elementRef.current?.value.slice(cursorStartIndex)
        const newText = `${startText}${elementText}${endText}`
        input.onChange(newText)

        // force focus then blur to trigger rerun of validations
        elementRef.current?.focus()
        elementRef.current?.blur()

        // then focus
        elementRef.current?.focus()
    }
}

export const MessageFields = ({
    messageVariables,
    messageTemplateRequired = false,
}: {
    messageVariables: Record<string, string>
    messageTemplateRequired?: boolean
}) => {
    const { input: subjectTemplateInput } = useField('subjectTemplate')
    const subjectRef = useRef<HTMLInputElement>(null)

    const { input: messageTemplateInput } = useField('messageTemplate')
    const messageRef = useRef<HTMLTextAreaElement>(null)

    const [subjectTemplateSelected, setSubjectTemplateSelected] = useState(true)
    return (
        <div className={styles.validationRuleContentContainer}>
            <div className={styles.validationRuleFieldsContainer}>
                <StandardFormField>
                    <FieldRFF name="subjectTemplate">
                        {({ input, meta }) => {
                            const showError = meta.error && meta.touched
                            return (
                                <div data-test="formfields-subjectTemplate">
                                    <label
                                        className={
                                            styles.validationRuleFieldLabel
                                        }
                                        data-test="formfields-subjectTemplate-label"
                                    >
                                        {i18n.t('Message subject')}
                                    </label>
                                    <div className={styles.validationRuleField}>
                                        <input
                                            className={
                                                showError
                                                    ? styles.inputError
                                                    : styles.input
                                            }
                                            {...input}
                                            ref={subjectRef}
                                            onChange={(e) => {
                                                input.onChange(e)
                                            }}
                                            onFocus={() => {
                                                setSubjectTemplateSelected(true)
                                            }}
                                            aria-describedby="subjectTemplate-help"
                                        />
                                        {showError && (
                                            <div className={styles.errorIcon}>
                                                <IconErrorFilled24
                                                    color={theme.error}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p
                                        id="subjectTemplate-help"
                                        className={styles.fieldHelpText}
                                    >
                                        {i18n.t(
                                            'Used as the template for the subject field.'
                                        )}
                                    </p>
                                    {showError && (
                                        <div
                                            className={styles.errorStyling}
                                            data-test="formfields-subjectTemplate-validation"
                                        >
                                            {meta.error}
                                        </div>
                                    )}
                                </div>
                            )
                        }}
                    </FieldRFF>
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF name="messageTemplate">
                        {({ input, meta }) => {
                            const showError = meta.error && meta.touched
                            return (
                                <div data-test="formfields-messageTemplate">
                                    <div
                                        className={
                                            styles.validationRuleFieldLabel
                                        }
                                    >
                                        {messageTemplateRequired
                                            ? i18n.t(
                                                  'Message body (required) *'
                                              )
                                            : i18n.t('Message body')}
                                    </div>
                                    <div className={styles.validationRuleField}>
                                        <textarea
                                            className={
                                                showError
                                                    ? styles.inputError
                                                    : styles.input
                                            }
                                            {...input}
                                            ref={messageRef}
                                            onFocus={() => {
                                                setSubjectTemplateSelected(
                                                    false
                                                )
                                            }}
                                            onChange={(e) => {
                                                input.onChange(e)
                                            }}
                                            aria-describedby="messageTemplate-help"
                                        />
                                        {showError && (
                                            <div className={styles.errorIcon}>
                                                <IconErrorFilled24
                                                    color={theme.error}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p
                                        id="messageTemplate-help"
                                        className={styles.fieldHelpText}
                                    >
                                        {i18n.t(
                                            'Used as the template for the message field.'
                                        )}
                                    </p>
                                    {showError && (
                                        <div
                                            className={styles.errorStyling}
                                            data-test="formfields-messageTemplate-validation"
                                        >
                                            {meta.error}
                                        </div>
                                    )}
                                </div>
                            )
                        }}
                    </FieldRFF>
                </StandardFormField>
            </div>

            <div className={styles.validationRuleVariablesContainer}>
                <div className={styles.templateVariablesText}>
                    {i18n.t('Insert a variable:', { nsSeparator: '~:~' })}
                </div>
                {Object.keys(messageVariables).map((v) => (
                    <div key={v} className={styles.variableButton}>
                        <Button
                            dataTest={`validationRule_button_${v}`}
                            small
                            onClick={() => {
                                insertElement({
                                    id: v,
                                    elementRef: subjectTemplateSelected
                                        ? subjectRef
                                        : messageRef,
                                    input: subjectTemplateSelected
                                        ? subjectTemplateInput
                                        : messageTemplateInput,
                                })
                            }}
                        >
                            {messageVariables[v]}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
