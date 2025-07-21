import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Checkbox,
    CircularLoader,
    IconChevronDown16,
    IconChevronUp16,
    InputField,
    Modal,
    ModalContent,
    ModalActions,
    NoticeBox,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { StandardFormSectionTitle } from '../../../components'
import {
    useBoundResourceQueryFn,
    DEFAULT_CATEGORY_OPTION_COMBO,
    parseErrorResponse,
} from '../../../lib/index'
import styles from './CustomFormSection.module.css'
import { useCompulsoryDataElementOperandsQuery } from './useGetCompulsoryDataElementOperandsOptions'

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

type FlagItemResponse = { name: string; key: string; path: string }

const useGetFlags = () => {
    const queryFn = useBoundResourceQueryFn()

    const queryResult = useQuery({
        queryKey: [
            {
                resource: 'system/flags',
            },
        ],
        queryFn: queryFn<FlagItemResponse[]>,
        staleTime: 60 * 1000,
        enabled: true,
        select: useCallback((data: FlagItemResponse[]) => {
            const flagSet = new Set<string>()
            return (
                data
                    .map((flag) => ({ displayName: flag.name, id: flag.key }))
                    // this is necessary at the moment to remove duplicate Denmark entry
                    .reduce((acc, flag) => {
                        if (!flagSet.has(flag.id)) {
                            flagSet.add(flag.id)
                            acc.push(flag)
                        }
                        return acc
                    }, [] as ElementItem[])
            )
        }, []),
    })

    return queryResult
}

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

const ElementsSelector = ({
    insertElement,
}: {
    insertElement: ElementSelectorFunction
}) => {
    const [selectedElementType, setSelectedElementType] =
        useState<string>('dataElement')

    const { input: indicatorsInput } = useField('indicators')
    const indicators = indicatorsInput.value

    // TO DO put this in a hook, I gues?
    const { input: dseInput } = useField('dataSetElements')
    const { data: deOperands } = useCompulsoryDataElementOperandsQuery({
        dataSetElements: dseInput.value,
    }) ?? {
        data: {},
    }
    const { dataElements, totals } = useMemo(() => {
        if (!deOperands) {
            return { dataElements: [], totals: [] }
        }
        const addedIds = new Set()

        const sorted = deOperands?.reduce(
            (
                acc: { dataElements: ElementItem[]; totals: ElementItem[] },
                deo
            ) => {
                // if operand coc is default, we use the display name of the data element, and do not add a total
                // TO DO look up this id from constants
                if (
                    deo.categoryOptionCombo.id ===
                    DEFAULT_CATEGORY_OPTION_COMBO.id
                ) {
                    acc.dataElements.push({
                        id: deo.id,
                        displayName: deo.dataElement.displayName,
                        key: deo.id,
                    })
                    return acc
                }
                acc.dataElements.push({
                    id: deo.id,
                    displayName: deo.displayName,
                })
                // add the total the first time the data element is encountered
                if (!addedIds.has(deo.dataElement.id)) {
                    addedIds.add(deo.dataElement.id)
                    acc.totals.push({
                        id: deo.dataElement.id,
                        displayName: deo.dataElement.displayName,
                    })
                }
                return acc
            },
            { dataElements: [], totals: [] }
        )
        return sorted
    }, [deOperands])
    const flagsQuery = useGetFlags()
    const flags = flagsQuery.data || []

    const elementTypes = [
        {
            name: i18n.t('Data elements'),
            elements: dataElements,
            type: 'dataElement',
        },
        { name: i18n.t('Totals'), elements: totals, type: 'total' },
        { name: i18n.t('Indicators'), elements: indicators, type: 'indicator' },
        { name: i18n.t('Flags'), elements: flags, type: 'flag' },
    ]

    const [fieldsDisabled, setFieldsDisabled] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')

    if (flagsQuery.isLoading) {
        return <CircularLoader />
    }
    return (
        <>
            <SubsectionSpacer>{i18n.t('Select elements')}</SubsectionSpacer>
            <SubsectionSpacer>
                <InputField
                    placeholder={i18n.t('Filter elements')}
                    onChange={(e) => {
                        setFilter(e?.value ?? '')
                    }}
                    value={filter}
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

const getElementText = ({
    id,
    name,
    type,
    disabled,
}: {
    id: string
    name?: string
    type: string
    disabled?: boolean
}): string => {
    if (type === 'dataElement') {
        const [de, coc] = id.split('.')
        return `<p><input ${
            disabled ? 'disabled="disabled"' : ''
        } id="${de}-${coc}-val" name="entryfield" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'total') {
        return `<p><input dataelementid="${id}" ${
            disabled ? 'disabled="disabled"' : ''
        } id="total${id}" name="total" readonly="readonly" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'indicator') {
        return `<p><input ${
            disabled ? 'disabled="disabled"' : ''
        } id="indicator${id}" indicatorid="${id}" name="indicator" readonly="readonly" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'flag') {
        return `<p><img src="../dhis-web-commons/flags/${id}.png" /></p>`
    }
    return ''
}

// mutations
// if there is no id for the data set, we need to create form separately

// if there is a data set id, we can post to the form endpoint
const useUpdateForm = () => {
    const id = useParams().id
    const dataEngine = useDataEngine()

    const update = useCallback(
        async (data: Record<string, unknown>) => {
            try {
                // const options = id ? {variables: {id}} : null
                const response = await dataEngine.mutate({
                    resource: `dataSets/${id}/form`,
                    type: 'create',
                    data: data,
                })
                return { data: response }
            } catch (error) {
                return { error: parseErrorResponse(error) }
            }
        },
        [dataEngine, id]
    )
    return update
}

// delete: we delete the form by form id
const useDeleteForm = ({
    id,
    onComplete,
}: {
    id: string
    onComplete: () => void
}) => {
    const dataEngine = useDataEngine()

    const deleteForm = useCallback(async () => {
        try {
            // const options = id ? {variables: {id}} : null
            const response = await dataEngine.mutate(
                {
                    resource: `dataEntryForms`,
                    type: 'delete',
                    id,
                },
                { onComplete }
            )
            return { data: response }
        } catch (error) {
            return { error: parseErrorResponse(error) }
        }
    }, [dataEngine, id])
    return deleteForm
}

const DeleteModal = ({
    closeModal,
    deleteCustomForm,
}: {
    closeModal: () => void
    deleteCustomForm: () => void
}) => (
    <Modal position="middle" onClose={closeModal}>
        <ModalContent>
            {i18n.t('Are you sure you want to delete this data entry form?')}
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button small>{i18n.t('Cancel')}</Button>
                <Button small destructive onClick={deleteCustomForm}>
                    {i18n.t('Delete')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

export const CustomFormSection = () => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [previewMode, togglePreviewMode] = useState<boolean>(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
        useState<boolean>(false)
    const { input: formInput } = useField('dataEntryForm')

    const insertElement = ({
        id,
        name,
        type,
        disabled,
    }: {
        id: string
        name?: string
        type: string
        disabled: boolean
    }) => {
        if (textAreaRef.current) {
            const elementText = getElementText({ id, name, type, disabled })

            const cursorStartIndex = textAreaRef.current?.selectionStart ?? 0
            const startText = textAreaRef.current?.value.slice(
                0,
                cursorStartIndex
            )
            const endText = textAreaRef.current?.value.slice(cursorStartIndex)
            const newText = `${startText}${elementText}${endText}`
            textAreaRef.current.value = newText
        }
    }

    useEffect(() => {
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.value = formInput?.value?.htmlCode ?? ''
    }, [formInput?.value?.htmlCode, textAreaRef])

    const clearForm = useCallback(() => {
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.value = ''
        setDeleteConfirmationOpen(false)
    }, [textAreaRef])

    const updateCustomForm = useUpdateForm()
    const deleteCustomForm = useDeleteForm({
        id: formInput?.value?.id ?? '',
        onComplete: clearForm,
    })

    const closeDeleteConfirmationModal = useCallback(() => {
        setDeleteConfirmationOpen(false)
    }, [setDeleteConfirmationOpen])

    return (
        <>
            {deleteConfirmationOpen && (
                <DeleteModal
                    closeModal={closeDeleteConfirmationModal}
                    deleteCustomForm={deleteCustomForm}
                />
            )}
            <StandardFormSectionTitle>
                {previewMode
                    ? i18n.t('Custom form (preview mode)')
                    : i18n.t('Custom form')}
            </StandardFormSectionTitle>
            <Button
                className={styles.formSectionSpacing}
                small
                onClick={() => {
                    togglePreviewMode((prev) => !prev)
                }}
            >
                {previewMode ? i18n.t('Edit') : i18n.t('Preview')}
            </Button>
            {previewMode && (
                <SubsectionSpacer>
                    {textAreaRef?.current?.value?.length === 0 ? (
                        <NoticeBox warning>
                            {i18n.t('Nothing to display')}
                        </NoticeBox>
                    ) : (
                        <iframe
                            srcDoc={textAreaRef.current?.value}
                            className={styles.iframeStyling}
                        ></iframe>
                    )}
                </SubsectionSpacer>
            )}
            <>
                <textarea
                    className={
                        previewMode
                            ? styles.textAreaHidden
                            : styles.textAreaStyling
                    }
                    ref={textAreaRef}
                ></textarea>
                <ElementsSelector insertElement={insertElement} />
                <ButtonStrip>
                    <Button
                        secondary
                        small
                        onClick={() => {
                            setDeleteConfirmationOpen(true)
                        }}
                    >
                        {i18n.t('Delete')}
                    </Button>
                    <Button secondary small>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        small
                        onClick={() => {
                            updateCustomForm({
                                htmlCode: textAreaRef.current?.value ?? '',
                            })
                        }}
                    >
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </>
        </>
    )
}
