import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import styles from './ValidationRuleContentFields.module.css'

export const VALIDATION_RULE_VARIABLES = {
    rule_name: i18n.t('Rule name'),
    rule_description: i18n.t('Rule description'),
    operator: i18n.t('Operator'),
    importance: i18n.t('Importance'),
    left_side_description: i18n.t('Left side description'),
    right_side_description: i18n.t('Right side description'),
    left_side_value: i18n.t('Left side value'),
    right_side_value: i18n.t('Right side value'),
    org_unit_name: i18n.t('Organisation unit name'),
    period: i18n.t('Period'),
    current_date: i18n.t('Current date'),
} as Record<string, string>

const insertElement = ({
    id,
    elementRef,
    input,
}: {
    id: string
    elementRef: any
    input: any
}) => {
    if (elementRef.current) {
        const elementText = `V{${id}}`

        const cursorStartIndex = elementRef.current?.selectionStart ?? 0
        const startText = elementRef.current?.value.slice(0, cursorStartIndex)
        const endText = elementRef.current?.value.slice(cursorStartIndex)
        const newText = `${startText}${elementText}${endText}`
        input.onChange(newText)
    }
}

export const ValidationRuleContentFields = () => {
    const { input: subjectTemplateInput } = useField('subjectTemplate')
    const subjectRef = useRef<HTMLInputElement>(null)
    const { input: messageTemplateInput } = useField('messageTemplate')
    const messageRef = useRef<HTMLTextAreaElement>(null)
    const [subjectTemplateSelected, setSubjectTemplateSelected] = useState(true)
    return (
        <div className={styles.validationRuleContentContainer}>
            <div>
                <StandardFormField>
                    <FieldRFF name="subjectTemplate">
                        {({ input, meta }) => (
                            <div
                                className={styles.validationRuleField}
                                data-test="formfields-subjectTemplate"
                            >
                                <div
                                    className={styles.validationRuleFieldLabel}
                                >
                                    {i18n.t('Message subject')}
                                </div>
                                <input
                                    className={styles.input}
                                    {...input}
                                    ref={subjectRef}
                                    onChange={(e) => {
                                        input.onChange(e)
                                    }}
                                    onFocus={() => {
                                        setSubjectTemplateSelected(true)
                                    }}
                                />
                                {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                )}
                            </div>
                        )}
                    </FieldRFF>
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF name="messageTemplate">
                        {({ input, meta }) => (
                            <div
                                className={styles.validationRuleField}
                                data-test="formfields-messageTemplate"
                            >
                                <div
                                    className={styles.validationRuleFieldLabel}
                                >
                                    {i18n.t('Message body')}
                                </div>
                                <textarea
                                    className={styles.input}
                                    {...input}
                                    ref={messageRef}
                                    onFocus={() => {
                                        setSubjectTemplateSelected(false)
                                    }}
                                    onChange={(e) => {
                                        input.onChange(e)
                                    }}
                                />
                                {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                )}
                            </div>
                        )}
                    </FieldRFF>
                </StandardFormField>
            </div>

            <div className={styles.validationRuleVariablesContainer}>
                <div className={styles.templateVariablesText}>
                    {i18n.t('Insert a variable:', { nsSeparator: '~:~' })}
                </div>
                {Object.keys(VALIDATION_RULE_VARIABLES).map((v) => (
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
                            {VALIDATION_RULE_VARIABLES[v]}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
