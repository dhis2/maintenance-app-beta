import i18n from '@dhis2/d2-i18n'
import { Button, Field, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import { uniqBy } from 'lodash'
import React, { useMemo, useState } from 'react'
import { FieldRenderProps, useField } from 'react-final-form'
import { BaseModelTransfer } from '../../../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import { DisplayableModel } from '../../../../../types/models'
import { DataSetDataElementsType } from './DataSetSectionFormContents'
import styles from './DataSetSectionFormContents.module.css'
import { GreyedField, GreyFieldsModal } from './GreyFieldsModal'

export type DataElementsTransferFieldProps = {
    isLoading: boolean
    dataSetElements?: DataSetDataElementsType['dataSetElements']
    sections?: DataSetDataElementsType['sections']
    sectionId: string
    input: FieldRenderProps<
        (DisplayableModel & { categoryCombo: { id: string } })[]
    >['input']
    meta: FieldRenderProps<
        (DisplayableModel & { categoryCombo: { id: string } })[]
    >['meta']
}

export const DataElementsTransferField = ({
    isLoading,
    dataSetElements,
    sections,
    sectionId,
    input,
    meta,
}: DataElementsTransferFieldProps) => {
    const { input: greyFieldInput } = useField<GreyedField[]>(
        'greyedFields',
        {}
    )

    const [catComboFilter, setCatComboFilter] = useState<string | undefined>()
    const [greyFieldModalOpen, setGreyFieldModalOpen] = useState(false)

    const isFilteringByCatCombo =
        catComboFilter !== undefined && catComboFilter !== 'all'

    const availableCategoryCombos = useMemo(() => {
        if (!dataSetElements) {
            return []
        }
        return uniqBy(
            dataSetElements.flatMap((de) => de.dataElement.categoryCombo),
            'id'
        )
    }, [dataSetElements])

    const availableDataElements = useMemo(() => {
        if (!sections || !dataSetElements) {
            return []
        }
        const otherSectionsDataElements = sections
            .filter((section) => section.id !== sectionId)
            .flatMap((section) => section.dataElements?.map((de) => de.id))
        return dataSetElements
            .map((de) => de.dataElement)
            .filter((de) => !otherSectionsDataElements.includes(de.id))
            .filter(
                (de) =>
                    !isFilteringByCatCombo ||
                    de.categoryCombo.id === catComboFilter
            )
    }, [
        sections,
        dataSetElements,
        catComboFilter,
        sectionId,
        isFilteringByCatCombo,
    ])

    const sectionCategoryCombos = useMemo(() => {
        if (!dataSetElements) {
            return []
        }
        const sectionsDataElements = dataSetElements.filter((de) =>
            input.value.map((v) => v.id).includes(de.dataElement.id)
        )
        return uniqBy(
            sectionsDataElements.flatMap((de) => de.dataElement.categoryCombo),
            'id'
        )
    }, [dataSetElements, input.value])

    return (
        <>
            <Field
                error={meta.invalid}
                validationText={(meta.touched && meta.error?.toString()) || ''}
                name="dataElements"
            >
                <BaseModelTransfer
                    loading={isLoading}
                    selected={input.value}
                    onChange={({ selected }) => {
                        input.onChange(selected)
                        input.onBlur()
                    }}
                    leftHeader={
                        <div className={styles.dataElementsTransferHeader}>
                            {i18n.t('Available data elements')}
                            <SingleSelect
                                dense
                                onChange={({ selected }) => {
                                    setCatComboFilter(selected)
                                }}
                                selected={
                                    catComboFilter === 'all'
                                        ? undefined
                                        : catComboFilter
                                }
                                placeholder={i18n.t(
                                    'Filter by category combination'
                                )}
                            >
                                <SingleSelectOption
                                    label={i18n.t('<No filter>')}
                                    value={'all'}
                                />
                                {availableCategoryCombos.map((catCombo) => (
                                    <SingleSelectOption
                                        key={catCombo.id}
                                        label={catCombo.displayName}
                                        value={catCombo.id}
                                    />
                                ))}
                            </SingleSelect>
                        </div>
                    }
                    rightHeader={
                        <div className={styles.dataElementsTransferHeader}>
                            {i18n.t('Selected data elements')}
                        </div>
                    }
                    rightFooter={
                        <div className={styles.dataElementsManageAction}>
                            <Button
                                small
                                onClick={() => {
                                    setGreyFieldModalOpen(true)
                                }}
                            >
                                {i18n.t('Manage enabled/disabled fields')}
                            </Button>
                        </div>
                    }
                    filterPlaceholder={i18n.t('Search available data elements')}
                    filterPlaceholderPicked={i18n.t(
                        'Search selected data elements'
                    )}
                    enableOrderChange
                    height={'350px'}
                    optionsWidth="500px"
                    selectedWidth="500px"
                    filterable
                    filterablePicked
                    available={[...availableDataElements, ...input.value]}
                    maxSelections={Infinity}
                />
            </Field>
            {greyFieldModalOpen && (
                <GreyFieldsModal
                    onClose={() => setGreyFieldModalOpen(false)}
                    dataElements={input.value}
                    input={greyFieldInput}
                    sectionCategoryCombos={sectionCategoryCombos}
                />
            )}
        </>
    )
}
