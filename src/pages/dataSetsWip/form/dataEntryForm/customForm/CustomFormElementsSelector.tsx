import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    CircularLoader,
    IconChevronDown16,
    IconChevronUp16,
    IconWarning16,
    InputField,
} from '@dhis2/ui'
import React, { useState } from 'react'
import styles from './CustomFormContents.module.css'
import { useGetCustomFormElements } from './useGetCustomFormElements'

export type CustomFormProps = {
    closeCustomFormEdit?: () => void
}

type ElementSelectorFunction = ({
    id,
    name,
    type,
    disabled,
}: {
    id: string
    name?: string
    type: string
    disabled: boolean
}) => void

const SubsectionSpacer = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.formSectionSpacing}>{children}</div>
)

type ElementItem = {
    id: string
    displayName: string
    key?: string
}

const ElementList = ({
    insertElement,
    elements,
    type,
    disabled,
}: {
    insertElement: ElementSelectorFunction
    elements: ElementItem[]
    type: string
    disabled: boolean
}) => {
    return (
        <ul className={styles.elementsList}>
            {elements.map((element) => (
                <li
                    key={`element_${element.id}`}
                    onClick={() => {
                        insertElement({
                            type,
                            id: element.id,
                            name: element.displayName,
                            disabled,
                        })
                    }}
                >
                    {element.displayName}
                </li>
            ))}
        </ul>
    )
}

export const CustomFormElementsSelector = ({
    insertElement,
    previewMode,
}: {
    insertElement: ElementSelectorFunction
    previewMode: boolean
}) => {
    const [selectedElementType, setSelectedElementType] =
        useState<string>('dataElement')

    const { loading, elementTypes } = useGetCustomFormElements()

    const [fieldsDisabled, setFieldsDisabled] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')

    if (loading) {
        return <CircularLoader />
    }
    return (
        <>
            <SubsectionSpacer>
                <div className={styles.customFormSubtitle}>
                    {i18n.t('Select elements')}
                </div>
                {previewMode && (
                    <div className={styles.previewElementsWarning}>
                        <IconWarning16 />
                        <div>
                            {i18n.t(
                                'Elements cannot be added while previewing the form'
                            )}
                        </div>
                    </div>
                )}
            </SubsectionSpacer>
            <SubsectionSpacer>
                <InputField
                    placeholder={i18n.t('Filter elements')}
                    onChange={(e) => {
                        setFilter(e?.value ?? '')
                    }}
                    value={filter}
                    className={styles.elementFilter}
                ></InputField>
            </SubsectionSpacer>

            <SubsectionSpacer>
                <Checkbox
                    checked={fieldsDisabled}
                    onChange={() => {
                        setFieldsDisabled((prev) => !prev)
                    }}
                    label={i18n.t('Insert grey (disabled) fields')}
                />
            </SubsectionSpacer>
            {elementTypes.map((elementType) => {
                const selected = selectedElementType === elementType.type
                const cleanedFilter = filter
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toLowerCase()
                const filteredElements = elementType.elements.filter(
                    (e: ElementItem) =>
                        e.displayName
                            .normalize('NFD')
                            .replace(/\p{Diacritic}/gu, '')
                            .toLowerCase()
                            .includes(cleanedFilter)
                )

                return (
                    <div
                        className={styles.elementSelectorBlock}
                        key={`selector_${elementType.type}`}
                    >
                        <div
                            className={styles.elementTypeTitle}
                            onClick={() => {
                                setSelectedElementType((prev) =>
                                    prev === elementType.type
                                        ? ''
                                        : elementType.type
                                )
                            }}
                        >
                            <span>
                                <span
                                    className={styles.elementTypePrefix}
                                >{`${elementType.name}: `}</span>
                                <span>{filteredElements.length}</span>
                            </span>
                            {selected ? (
                                <IconChevronUp16 />
                            ) : (
                                <IconChevronDown16 />
                            )}
                        </div>
                        {selected && (
                            <ElementList
                                insertElement={insertElement}
                                elements={filteredElements}
                                type={elementType.type}
                                disabled={fieldsDisabled}
                            ></ElementList>
                        )}
                    </div>
                )
            })}
        </>
    )
}
