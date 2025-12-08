import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    IconChevronDown16,
    IconChevronRight16,
    IconCheckmarkCircle16,
    IconErrorFilled24,
    IconInfo16,
    theme,
} from '@dhis2/ui'
import React, { useCallback, useRef, useState, RefObject } from 'react'
import { Field as FieldRFF, useField, FieldInputProps } from 'react-final-form'
import { StandardFormField } from '../standardForm'
import styles from './ExpressionBuilder.module.css'
import { ExpressionList } from './ExpressionList'

const insertElementNonClosure = ({
    elementText,
    elementRef,
    input,
}: {
    elementText: string
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
}) => {
    if (elementRef.current) {
        const cursorStartIndex = elementRef.current?.selectionStart ?? 0
        const startText = elementRef.current?.value.slice(0, cursorStartIndex)
        const endText = elementRef.current?.value.slice(cursorStartIndex)
        const newText = `${startText}${elementText}${endText}`
        input.onChange(newText)

        // force focus then blur to trigger rerun of validations
        elementRef.current?.focus()

        // need to set cursor index to match where element was added (not working)
        // elementRef.current.selectionStart = cursorStartIndex
    }
}

type InsertElement = (s: string) => void

const DATA_ELEMENTS_QUERY = {
    resource: 'dataElementOperands',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
    },
}

const DataElementsList = ({
    insertElement,
}: {
    insertElement: InsertElement
}) => {
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`#{${s}}`)
        },
        [insertElement]
    )
    return (
        <ExpressionList
            query={DATA_ELEMENTS_QUERY}
            insertElement={insertElementFormatted}
        />
    )
}

const CONSTANTS_QUERY = {
    resource: 'constants',
    params: {
        fields: ['id', 'displayName'],
        order: ['displayName'],
    },
}

const ConstantsList = ({ insertElement }: { insertElement: InsertElement }) => {
    const insertElementFormatted = useCallback(
        (s: string) => {
            insertElement(`{${s}}`)
        },
        [insertElement]
    )
    return (
        <ExpressionList
            query={CONSTANTS_QUERY}
            insertElement={insertElementFormatted}
        />
    )
}

type Element = {
    value: string
    label: string
}
type ElementType = {
    type: string
    name: string
    elements?: Element[]
    component?: React.ComponentType<{
        elements: Element[]
        insertElement: InsertElement
    }>
}

const elementTypes: ElementType[] = [
    {
        type: 'operator',
        name: i18n.t('Operators'),
        elements: [
            { value: '+', label: i18n.t('+ (add)') },
            { value: '-', label: i18n.t('- (subtract)') },
            { value: '*', label: i18n.t('* (multiply)') },
            { value: '/', label: i18n.t('/ (divide)') },
        ],
    },
    {
        type: 'dataElement',
        name: i18n.t('Data elements'),
        component: DataElementsList,
    },
    {
        type: 'constants',
        name: i18n.t('Constants'),
        component: ConstantsList,
    },
]

const DefaultList = ({
    elements,
    insertElement,
}: {
    elements: Element[]
    insertElement: InsertElement
}) => {
    return (
        <ul className={styles.elementList}>
            {elements.map((element) => (
                <li
                    key={element.value}
                    onClick={() => {
                        insertElement(element.value)
                    }}
                >
                    {element.label}
                </li>
            ))}
        </ul>
    )
}

const VariableSelectionBox = ({
    elementRef,
    input,
}: {
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
}) => {
    const [selectedElementType, setSelectedElementType] = useState<string[]>([])
    const updateElementTypes = (elementType: string) => {
        setSelectedElementType((prev) => {
            const filtered = prev.filter((t) => t !== elementType)
            return prev.includes(elementType)
                ? filtered
                : [...filtered, elementType]
        })
    }
    const insertElementClosure = useCallback(
        (insertText: string) => {
            insertElementNonClosure({
                elementText: insertText,
                elementRef: elementRef,
                input: input,
            })
        },
        [elementRef, input]
    )

    return (
        <div className={styles.validationRuleVariablesContainer}>
            {elementTypes.map((elementType) => {
                const selected = selectedElementType.includes(elementType.type)
                const ElementListContainer =
                    elementType?.component ?? DefaultList

                return (
                    <div
                        className={styles.elementSelectorBlock}
                        key={`selector_${elementType.type}`}
                    >
                        <details
                            onToggle={() => {
                                updateElementTypes(elementType.type)
                            }}
                        >
                            <summary className={styles.elementTypeTitleSummary}>
                                {selected ? (
                                    <IconChevronDown16 />
                                ) : (
                                    <IconChevronRight16 />
                                )}

                                <span className={styles.elementTypePrefix}>
                                    {elementType.name}
                                </span>
                            </summary>
                            <div className={styles.elementListContainer}>
                                <ElementListContainer
                                    elements={elementType.elements ?? []}
                                    insertElement={insertElementClosure}
                                />
                            </div>
                        </details>
                    </div>
                )
            })}
        </div>
    )
}

const ValidationBox = () => {
    return (
        <div className={styles.validationBox}>
            <div>ANC1 Coverage + ANC2 Coverage</div>
            <div className={styles.validationBoxResultText}>
                <IconCheckmarkCircle16 />
                <span>Valid expression</span>
            </div>
        </div>
    )
}

export const ExpressionBuilder = ({
    fieldName = 'leftSideExpression',
}: {
    fieldName?: string
}) => {
    const { input: expressionInput } = useField(fieldName)
    const expressionRef = useRef<HTMLTextAreaElement>(null)

    return (
        <div>
            <div className={styles.expressionBuilderContentContainer}>
                <div className={styles.expressionBuilderEntryContainer}>
                    <StandardFormField>
                        <FieldRFF name={fieldName}>
                            {({ input, meta }) => {
                                const showError = meta.error && meta.touched
                                return (
                                    <div data-test="formfields-expressionBuilder">
                                        <div className={styles.expressionField}>
                                            <textarea
                                                className={
                                                    showError
                                                        ? styles.inputError
                                                        : styles.input
                                                }
                                                {...input}
                                                ref={expressionRef}
                                                onChange={(e) => {
                                                    input.onChange(e)
                                                }}
                                                onBlur={() => {
                                                    console.log('I was blurred')
                                                }}
                                                aria-describedby="messageTemplate-help"
                                            />
                                            {showError && (
                                                <div
                                                    className={styles.errorIcon}
                                                >
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
                    <ValidationBox />
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
                />
            </div>
            <ButtonStrip end>
                <Button>{i18n.t('Cancel')}</Button>
                <Button primary>{i18n.t('Apply')}</Button>
            </ButtonStrip>
        </div>
    )
}
