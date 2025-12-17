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
    clearValidationState,
}: {
    elementText: string
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    clearValidationState: () => void
}) => {
    if (elementRef.current) {
        const cursorStartIndex = elementRef.current?.selectionStart ?? 0
        const startText = elementRef.current?.value.slice(0, cursorStartIndex)
        const endText = elementRef.current?.value.slice(cursorStartIndex)
        const newText = `${startText}${elementText}${endText}`
        elementRef.current.value = newText

        // clear validation state to ensure revalidation
        clearValidationState()

        // should set cursor index to match where element was added (not working)
        // elementRef.current.selectionStart = cursorStartIndex
    }
}

export const VariableSelectionBox = ({
    elementRef,
    input,
    clearValidationState,
}: {
    elementRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
    input: FieldInputProps<string>
    clearValidationState: () => void
}) => {
    const elementTypes = validationRuleElementTypes
    const [selectedElementType, setSelectedElementType] = useState<
        string | undefined
    >()
    const updateElementType = useCallback(
        (elementType: string) => {
            setSelectedElementType((prev) => {
                if (prev === elementType) {
                    return undefined
                }
                return elementType
            })
        },
        [setSelectedElementType]
    )
    const insertElementClosure = useCallback(
        (insertText: string) => {
            insertElementNonClosure({
                elementText: insertText,
                elementRef: elementRef,
                clearValidationState: clearValidationState,
            })
        },
        [elementRef, input]
    )

    return (
        <div className={styles.validationRuleVariablesContainer}>
            {elementTypes.map((elementType: ElementType) => {
                const ElementListContainer = elementType.component

                return (
                    <div
                        className={styles.elementSelectorBlock}
                        key={`selector_${elementType.type}`}
                    >
                        <details
                            onClick={() => {
                                updateElementType(elementType.type)
                            }}
                            name="variableSelectionMenu"
                        >
                            <summary className={styles.elementTypeTitleSummary}>
                                {elementType.type === selectedElementType ? (
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
