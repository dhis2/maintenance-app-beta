import { IconChevronDown16, IconChevronRight16 } from '@dhis2/ui'
import React, { useCallback, useState, RefObject } from 'react'
import { FieldInputProps } from 'react-final-form'
import styles from './ExpressionBuilder.module.css'
import {
    ElementType,
    validationRuleElementTypes,
} from './ValidationRuleVariables'

const insertElementNonClosure = ({
    elementText,
    elementRef,
    validate,
}: {
    elementText: string
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    validate: (s: string) => void
}) => {
    if (elementRef.current) {
        const cursorStartIndex = elementRef.current?.selectionStart ?? 0
        const startText = elementRef.current?.value.slice(0, cursorStartIndex)
        const endText = elementRef.current?.value.slice(cursorStartIndex)
        const newText = `${startText}${elementText}${endText}`
        elementRef.current.value = newText

        // run validation and force focus
        validate(newText)
        elementRef.current?.focus()
        elementRef.current?.blur()
        elementRef.current?.focus()

        // need to set cursor index to match where element was added (not working)
        // elementRef.current.selectionStart = cursorStartIndex
    }
}

export const VariableSelectionBox = ({
    elementRef,
    input,
    validate,
}: {
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
    validate: (s: string) => void
}) => {
    const elementTypes = validationRuleElementTypes
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
                validate: validate,
            })
        },
        [elementRef, input]
    )

    return (
        <div className={styles.validationRuleVariablesContainer}>
            {elementTypes.map((elementType: ElementType) => {
                const selected = selectedElementType.includes(elementType.type)
                const ElementListContainer = elementType.component

                return (
                    <div
                        className={styles.elementSelectorBlock}
                        key={`selector_${elementType.type}`}
                    >
                        <details
                            onToggle={() => {
                                updateElementTypes(elementType.type)
                            }}
                            name={elementType.type}
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
