import i18n from '@dhis2/d2-i18n'
import { Button, IconErrorFilled24, theme } from '@dhis2/ui'
import React, { useRef, useState, useEffect, RefObject } from 'react'
import { Field as FieldRFF, useField, FieldInputProps } from 'react-final-form'
import { StandardFormField } from '../standardForm'
import styles from './MessageFields.module.css'

type MessageVariablesType = 'VARIABLE' | 'ATTRIBUTE' | 'DATA_ELEMENT'
export type MessageVariables = Record<
    string,
    { label: string; type: MessageVariablesType }
>
const insertElement = ({
    id,
    type,
    elementRef,
    input,
}: {
    id: string
    type: MessageVariablesType
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
}): number | undefined => {
    if (!elementRef.current) {
        return
    }

    const elementText =
        type === 'VARIABLE'
            ? `V{${id}}`
            : type === 'ATTRIBUTE'
            ? `A{${id}}`
            : `#{${id}}`

    const cursorStartIndex = elementRef.current.selectionStart ?? 0
    const value = elementRef.current.value
    const newText =
        value.slice(0, cursorStartIndex) +
        elementText +
        value.slice(cursorStartIndex)
    input.onChange(newText)

    // force focus then blur to trigger rerun of validations
    elementRef.current.focus()
    elementRef.current.blur()
    elementRef.current.focus()

    return cursorStartIndex + elementText.length
}

export const MessageFields = ({
    messageVariables,
    messageTemplateRequired = false,
}: {
    messageVariables: MessageVariables
    messageTemplateRequired?: boolean
}) => {
    const { input: subjectTemplateInput } = useField('subjectTemplate')
    const subjectRef = useRef<HTMLInputElement>(null)

    const { input: messageTemplateInput } = useField('messageTemplate')
    const messageRef = useRef<HTMLTextAreaElement>(null)

    const [subjectTemplateSelected, setSubjectTemplateSelected] = useState(true)

    const pendingCursorRef = useRef<{
        elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
        position: number
    } | null>(null)

    useEffect(() => {
        if (pendingCursorRef.current) {
            const { elementRef, position } = pendingCursorRef.current
            elementRef.current?.setSelectionRange(position, position)
            pendingCursorRef.current = null
        }
    }, [pendingCursorRef.current])

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
                                            ? i18n.t('Message body *')
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
                            secondary
                            dataTest={`validationRule_button_${v}`}
                            small
                            onClick={() => {
                                const elementRef = subjectTemplateSelected
                                    ? subjectRef
                                    : messageRef
                                const position = insertElement({
                                    id: v,
                                    type: messageVariables[v].type,
                                    elementRef,
                                    input: subjectTemplateSelected
                                        ? subjectTemplateInput
                                        : messageTemplateInput,
                                })
                                if (position !== undefined) {
                                    pendingCursorRef.current = {
                                        elementRef,
                                        position,
                                    }
                                }
                            }}
                        >
                            {messageVariables[v].label}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
