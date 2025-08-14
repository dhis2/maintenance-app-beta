import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Checkbox,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
} from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { FieldInputProps } from 'react-final-form'
import { DisplayableModel } from '../../../../../types/models'
import { CategoryCombosType } from './DataSetSectionFormContents'
import styles from './GreyFieldsModal.module.css'

export type GreyedField = {
    dataElement: { id: string }
    categoryOptionCombo: { id: string }
}

export const GreyFieldsModal = ({
    onClose,
    categoryCombos,
    dataElements,
    input,
}: {
    onClose: () => void
    categoryCombos: CategoryCombosType['categoryCombos'] | undefined
    dataElements: DisplayableModel[] | undefined
    input: FieldInputProps<GreyedField[]>
}) => {
    const [localGreyedFields, setLocalGreyedFields] = useState<GreyedField[]>(
        input.value || []
    )
    const [catCombo, setCatCombo] = useState<string | undefined>(
        categoryCombos?.at(0)?.id
    )

    const isGrayedOut = (
        dataElementId: string,
        categoryOptionComboId: string
    ) =>
        localGreyedFields.some(
            (gf) =>
                gf.dataElement.id === dataElementId &&
                gf.categoryOptionCombo.id === categoryOptionComboId
        )

    const onGrayOut = (
        dataElementId: string,
        categoryOptionComboId: string
    ) => {
        setLocalGreyedFields((prev) =>
            isGrayedOut(dataElementId, categoryOptionComboId)
                ? prev.filter(
                      (gf) =>
                          gf.dataElement.id !== dataElementId ||
                          gf.categoryOptionCombo.id !== categoryOptionComboId
                  )
                : [
                      ...prev,
                      {
                          dataElement: { id: dataElementId },
                          categoryOptionCombo: { id: categoryOptionComboId },
                      },
                  ]
        )
    }

    const selectedCatComboData = useMemo(() => {
        return catCombo !== undefined
            ? categoryCombos?.find((cc) => cc.id === catCombo)
            : catCombo
    }, [catCombo, categoryCombos])

    const addCategoryOptionToCategory = (
        categoryOption: DisplayableModel & { categories: { id: string }[] },
        categories: (DisplayableModel & {
            categoryOptions: DisplayableModel[]
        })[]
    ) => {
        categoryOption.categories.forEach((optionCategory) => {
            const category = categories.find(
                (cat) => cat.id === optionCategory.id
            )
            if (category) {
                category.categoryOptions.push({
                    id: categoryOption.id,
                    displayName: categoryOption.displayName,
                })
            }
        })
    }

    const categoriesWithCategoriesOptions = useMemo(() => {
        if (!selectedCatComboData) {
            return []
        }

        const categories = selectedCatComboData.categories.map((cat) => ({
            id: cat.id,
            displayName: cat.displayName,
            categoryOptions: [] as { id: string; displayName: string }[],
        }))

        selectedCatComboData.categoryOptionCombos.forEach((catOptionCombo) => {
            catOptionCombo.categoryOptions.forEach((catOption) => {
                addCategoryOptionToCategory(catOption, categories)
            })
        })

        return categories
    }, [selectedCatComboData])

    return (
        <Modal onClose={onClose} large>
            <ModalTitle>{i18n.t('Manage grey fields')}</ModalTitle>
            <ModalContent>
                <SingleSelect
                    dense
                    onChange={({ selected }) => {
                        setCatCombo(selected)
                    }}
                    selected={catCombo}
                    placeholder={i18n.t('Filter by category combination')}
                >
                    {categoryCombos &&
                        categoryCombos.map((catCombo) => (
                            <SingleSelectOption
                                key={catCombo.id}
                                label={catCombo.displayName}
                                value={catCombo.id}
                            />
                        ))}
                </SingleSelect>
                <Table>
                    {categoriesWithCategoriesOptions.map((cat, index) => (
                        <TableHead key={cat.id}>
                            <TableCellHead key={`${cat.id}-data-elements`}>
                                {index ===
                                categoriesWithCategoriesOptions.length - 1
                                    ? i18n.t('Data elements')
                                    : undefined}
                            </TableCellHead>
                            {cat.categoryOptions.map((catOption, index) => (
                                <TableCellHead key={`${catOption.id}-${index}`}>
                                    {catOption.displayName}
                                </TableCellHead>
                            ))}
                        </TableHead>
                    ))}
                    <TableBody>
                        {dataElements?.map((de) => (
                            <TableRow key={de.id}>
                                <TableCell>{de.displayName}</TableCell>
                                {selectedCatComboData?.categoryOptionCombos.map(
                                    (catOptionCombo) => (
                                        <TableCell
                                            key={catOptionCombo.id}
                                            className={styles.greyedCell}
                                        >
                                            <div
                                                className={
                                                    styles.greyedCellContent
                                                }
                                            >
                                                <Checkbox
                                                    onChange={() =>
                                                        onGrayOut(
                                                            de.id,
                                                            catOptionCombo.id
                                                        )
                                                    }
                                                    checked={
                                                        !isGrayedOut(
                                                            de.id,
                                                            catOptionCombo.id
                                                        )
                                                    }
                                                />
                                                {isGrayedOut(
                                                    de.id,
                                                    catOptionCombo.id
                                                )
                                                    ? i18n.t('Disabled')
                                                    : i18n.t('Enabled')}
                                            </div>
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        primary
                        onClick={() => {
                            input.onChange(localGreyedFields)
                            input.onBlur()
                            onClose()
                        }}
                    >
                        {i18n.t('Update grey fields')}
                    </Button>

                    <Button
                        onClick={() => {
                            onClose()
                        }}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
