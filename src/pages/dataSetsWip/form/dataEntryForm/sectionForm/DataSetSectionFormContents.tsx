import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CheckboxFieldFF,
    Field,
    RadioFieldFF,
    SingleSelect,
    SingleSelectFieldFF,
    SingleSelectOption,
    TextAreaFieldFF,
} from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { uniqBy } from 'lodash'
import React, { useMemo, useState } from 'react'
import {
    useField,
    useForm,
    useFormState,
    Field as FieldRFF,
} from 'react-final-form'
import {
    CodeField,
    DescriptionField,
    FormFooterWrapper,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    TransferHeader,
} from '../../../../../components'
import { DefaultFormErrorNotice } from '../../../../../components/form/DefaultFormErrorNotice'
import { BaseModelTransfer } from '../../../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import {
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
} from '../../../../../lib'
import { DisplayableModel } from '../../../../../types/models'
import type { SectionFormValues } from './DataSetSectionForm'
import styles from './DataSetSectionFormContents.module.css'
import { GreyedField, GreyFieldsModal } from './GreyFieldsModal'

const dataSetSectionSchemaSection = {
    name: SchemaName.section,
    namePlural: 'sections',
    title: i18n.t('Section'),
    titlePlural: i18n.t('Sections'),
    parentSectionKey: 'dataSet',
} satisfies SchemaSection

export type DataSetSectionFormProps = {
    onCancel?: () => void
}

type DataSetDataElementsType = {
    dataSetElements: {
        dataElement: DisplayableModel & {
            categoryCombo: DisplayableModel
        }
    }[]
    sections: { dataElements: { id: string }[]; id: string }[]
    indicators: DisplayableModel[]
}

export type CategoryCombosType = {
    categoryCombos: (DisplayableModel & {
        categories: DisplayableModel[]
        categoryOptionCombos: (DisplayableModel & {
            categoryOptions: (DisplayableModel & {
                categories: { id: string }[]
            })[]
        })[]
    })[]
}

export const DataSetSectionFormContents = ({
    onCancel,
}: DataSetSectionFormProps) => {
    const form = useForm<SectionFormValues>()
    const { submitting, values } = useFormState({
        subscription: { submitting: true, values: true },
    })

    const { input: dataElementsInput, meta: dataElementsMeta } = useField<
        (DisplayableModel & { categoryCombo: { id: string } })[]
    >('dataElements', {
        multiple: true,
        validateFields: [],
    })

    const { input: indicatorsInput, meta: indicatorsMeta } = useField<
        DisplayableModel[]
    >('indicators', {
        multiple: true,
        validateFields: [],
    })

    const defaultDisplayModeField = useField(`displayOptions.pivotMode`, {
        type: 'radio',
        value: 'n/a',
    })
    const pivotDisplayModeField = useField(`displayOptions.pivotMode`, {
        type: 'radio',
        value: 'pivot',
    })
    const moveCategoriesDisplayModeField = useField(
        `displayOptions.pivotMode`,
        {
            type: 'radio',
            value: 'move_categories',
        }
    )
    const { input: greyFieldInput } = useField<GreyedField[]>(
        'greyedFields',
        {}
    )

    const queryFn = useBoundResourceQueryFn()
    const { data, isLoading } = useQuery({
        queryFn: queryFn<DataSetDataElementsType>,
        queryKey: [
            {
                resource: 'dataSets',
                id: values.dataSet.id,
                params: {
                    fields: [
                        'dataSetElements[dataElement[id,displayName,categoryCombo[id,displayName]]]',
                        'indicators[id,displayName]',
                        'sections[dataElements, id]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const [catComboFilter, setCatComboFilter] = useState<string | undefined>()
    const [greyFieldModalOpen, setGreyFieldModalOpen] = useState(false)
    const isFilteringByCatCombo =
        catComboFilter !== undefined && catComboFilter !== 'all'

    const availableDataElements = useMemo(() => {
        if (!data) {
            return []
        }
        const otherSectionsDataElements = data?.sections
            .filter((section) => section.id !== values.id)
            .flatMap((section) => section.dataElements?.map((de) => de.id))
        return data.dataSetElements
            .map((de) => de.dataElement)
            .filter((de) => !otherSectionsDataElements.includes(de.id))
            .filter(
                (de) =>
                    !isFilteringByCatCombo ||
                    de.categoryCombo.id === catComboFilter
            )
    }, [data, catComboFilter, values.id, isFilteringByCatCombo])

    const sectionCategoryCombos = useMemo(() => {
        if (!data) {
            return []
        }
        const sectionsDataElements = data.dataSetElements.filter((de) =>
            dataElementsInput.value.map((v) => v.id).includes(de.dataElement.id)
        )
        return uniqBy(
            sectionsDataElements.flatMap((de) => de.dataElement.categoryCombo),
            'id'
        )
    }, [data, dataElementsInput.value])

    const availableCategoryCombos = useMemo(() => {
        if (!data) {
            return []
        }
        return uniqBy(
            data.dataSetElements.flatMap((de) => de.dataElement.categoryCombo),
            'id'
        )
    }, [data])

    const { data: categoriesComboData } = useQuery({
        queryFn: queryFn<CategoryCombosType>,
        queryKey: [
            {
                resource: 'categoryCombos',
                params: {
                    filter: [
                        `id:in:[${sectionCategoryCombos.map((cc) => cc.id)}]`,
                    ],
                    fields: 'id,displayName,categories[id,displayName],categoryOptionCombos[id,displayName,categoryOptions[id,displayName,categories[id]]]',
                },
            },
        ] as const,
    })

    const availableCategories = useMemo(() => {
        if (!categoriesComboData) {
            return []
        }
        return uniqBy(
            categoriesComboData.categoryCombos
                .map((cc) => cc.categories)
                .flat(1),
            'id'
        )
    }, [categoriesComboData])

    return (
        <>
            <div className={styles.sectionsWrapper}>
                <div>
                    <SectionedFormSections>
                        <SectionedFormSection name="setup">
                            <StandardFormSectionTitle>
                                {i18n.t('Section setup')}
                            </StandardFormSectionTitle>
                            <StandardFormSectionDescription>
                                {i18n.t(
                                    'Setup the basic information for this section.'
                                )}
                            </StandardFormSectionDescription>
                            <StandardFormField>
                                <NameField
                                    schemaSection={dataSetSectionSchemaSection}
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <CodeField
                                    schemaSection={dataSetSectionSchemaSection}
                                    modelId={values.id}
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <DescriptionField
                                    helpText={i18n.t(
                                        'Explain the purpose of this section, which will be shown in the data entry form.'
                                    )}
                                />
                            </StandardFormField>
                        </SectionedFormSection>
                        <SectionedFormSection name="sectionDataElements">
                            <StandardFormSectionTitle>
                                {i18n.t('Section data elements')}
                            </StandardFormSectionTitle>
                            <StandardFormSectionDescription>
                                {i18n.t(
                                    'Choose what data is collected for this section.'
                                )}
                            </StandardFormSectionDescription>
                            <Field
                                error={dataElementsMeta.invalid}
                                validationText={
                                    (dataElementsMeta.touched &&
                                        dataElementsMeta.error?.toString()) ||
                                    ''
                                }
                                name="dataElements"
                            >
                                <BaseModelTransfer
                                    loading={isLoading}
                                    selected={dataElementsInput.value}
                                    onChange={({ selected }) => {
                                        dataElementsInput.onChange(selected)
                                        dataElementsInput.onBlur()
                                    }}
                                    leftHeader={
                                        <div
                                            className={
                                                styles.dataElementsTransferHeader
                                            }
                                        >
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
                                                    label={i18n.t(
                                                        '<No filter>'
                                                    )}
                                                    value={'all'}
                                                />
                                                {availableCategoryCombos.map(
                                                    (catCombo) => (
                                                        <SingleSelectOption
                                                            key={catCombo.id}
                                                            label={
                                                                catCombo.displayName
                                                            }
                                                            value={catCombo.id}
                                                        />
                                                    )
                                                )}
                                            </SingleSelect>
                                        </div>
                                    }
                                    rightHeader={
                                        <div
                                            className={
                                                styles.dataElementsTransferHeader
                                            }
                                        >
                                            {i18n.t('Selected data elements')}
                                        </div>
                                    }
                                    rightFooter={
                                        <div
                                            className={
                                                styles.dataElementsManageAction
                                            }
                                        >
                                            <Button
                                                small
                                                onClick={() => {
                                                    setGreyFieldModalOpen(true)
                                                }}
                                            >
                                                {i18n.t(
                                                    'Manage enabled/disabled fields'
                                                )}
                                            </Button>
                                        </div>
                                    }
                                    filterPlaceholder={i18n.t(
                                        'Search available data elements'
                                    )}
                                    filterPlaceholderPicked={i18n.t(
                                        'Search selected data elements'
                                    )}
                                    enableOrderChange
                                    height={'350px'}
                                    optionsWidth="500px"
                                    selectedWidth="500px"
                                    filterable
                                    filterablePicked
                                    available={[
                                        ...availableDataElements,
                                        ...dataElementsInput.value,
                                    ]}
                                    maxSelections={Infinity}
                                />
                            </Field>
                        </SectionedFormSection>
                        <SectionedFormSection name="sectionIndicators">
                            <StandardFormSectionTitle>
                                {i18n.t('Section indicators')}
                            </StandardFormSectionTitle>
                            <StandardFormSectionDescription>
                                {i18n.t(
                                    'Choose what indicators are shown in this section.'
                                )}
                            </StandardFormSectionDescription>
                            <Field
                                error={indicatorsMeta.invalid}
                                validationText={
                                    (indicatorsMeta.touched &&
                                        indicatorsMeta.error?.toString()) ||
                                    ''
                                }
                                name="indicators"
                            >
                                <BaseModelTransfer
                                    selected={indicatorsInput.value}
                                    onChange={({ selected }) => {
                                        indicatorsInput.onChange(selected)
                                        indicatorsInput.onBlur()
                                    }}
                                    leftHeader={
                                        <TransferHeader>
                                            {i18n.t('Available indicators')}
                                        </TransferHeader>
                                    }
                                    rightHeader={
                                        <TransferHeader>
                                            {i18n.t('Selected indicators')}
                                        </TransferHeader>
                                    }
                                    filterPlaceholder={i18n.t(
                                        'Search available indicators'
                                    )}
                                    filterPlaceholderPicked={i18n.t(
                                        'Search selected indicators'
                                    )}
                                    enableOrderChange
                                    height={'350px'}
                                    optionsWidth="500px"
                                    selectedWidth="500px"
                                    filterable
                                    filterablePicked
                                    available={data?.indicators ?? []}
                                    maxSelections={Infinity}
                                />
                            </Field>
                        </SectionedFormSection>
                        <SectionedFormSection name="displayOptions">
                            <StandardFormSectionTitle>
                                {i18n.t('Display options')}
                            </StandardFormSectionTitle>
                            <StandardFormSectionDescription>
                                {i18n.t(
                                    'Customize how this section looks in the form.'
                                )}
                            </StandardFormSectionDescription>
                            <StandardFormField>
                                <FieldRFF
                                    name="showRowTotals"
                                    type="checkbox"
                                    dataTest="formfields-showRowTotals"
                                    component={CheckboxFieldFF}
                                    label={i18n.t('Row totals')}
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <FieldRFF
                                    name="showColumnTotals"
                                    type="checkbox"
                                    dataTest="formfields-showColumnTotals"
                                    component={CheckboxFieldFF}
                                    label={i18n.t('Column totals')}
                                />
                            </StandardFormField>
                            <StandardFormField>
                                <FieldRFF
                                    name="disableDataElementAutoGroup"
                                    type="checkbox"
                                    dataTest="formfields-disableDataElementAutoGroup"
                                    component={CheckboxFieldFF}
                                    label={i18n.t(
                                        'Disable automatic grouping of data elements'
                                    )}
                                />
                            </StandardFormField>
                            <div>
                                <p>{i18n.t('Display mode')}</p>
                                <div className={styles.displayModeOptions}>
                                    <StandardFormField>
                                        <RadioFieldFF
                                            label={i18n.t(
                                                'Default: data elements as rows, categories as columns',
                                                { nsSeparator: '~:~' }
                                            )}
                                            input={
                                                defaultDisplayModeField.input
                                            }
                                            meta={defaultDisplayModeField.meta}
                                        />
                                    </StandardFormField>
                                    <StandardFormField>
                                        <RadioFieldFF
                                            label={i18n.t(
                                                'Pivot: categories as rows, data elements as columns',
                                                { nsSeparator: '~:~' }
                                            )}
                                            input={pivotDisplayModeField.input}
                                            meta={pivotDisplayModeField.meta}
                                        />
                                    </StandardFormField>
                                    <StandardFormField>
                                        <RadioFieldFF
                                            label={i18n.t(
                                                'Move a category to rows: default mode with one category moved to rows',
                                                { nsSeparator: '~:~' }
                                            )}
                                            input={
                                                moveCategoriesDisplayModeField.input
                                            }
                                            meta={
                                                moveCategoriesDisplayModeField.meta
                                            }
                                        />
                                    </StandardFormField>
                                </div>
                                {moveCategoriesDisplayModeField.input.checked &&
                                    availableCategories.length > 1 &&
                                    data && (
                                        <div
                                            className={
                                                styles.pivotedCategorySelector
                                            }
                                        >
                                            <FieldRFF
                                                required
                                                component={SingleSelectFieldFF}
                                                inputWidth="400px"
                                                name="displayOptions.pivotedCategory"
                                                label={i18n.t(
                                                    'Category to move to rows'
                                                )}
                                                options={availableCategories.map(
                                                    (cc) => ({
                                                        value: cc.id,
                                                        label: cc.displayName,
                                                    })
                                                )}
                                            />
                                        </div>
                                    )}
                                <StandardFormField>
                                    <FieldRFF
                                        component={TextAreaFieldFF}
                                        inputWidth="400px"
                                        name="displayOptions.beforeSectionText"
                                        label={i18n.t(
                                            'Content to display before a section'
                                        )}
                                        helpText={i18n.t(
                                            'HTML links and basic styling can be included'
                                        )}
                                        format={(value) =>
                                            typeof value === 'string'
                                                ? DOMPurify.sanitize(value)
                                                : value
                                        }
                                    />
                                </StandardFormField>
                                <StandardFormField>
                                    <FieldRFF
                                        component={TextAreaFieldFF}
                                        inputWidth="400px"
                                        name="displayOptions.afterSectionText"
                                        label={i18n.t(
                                            'Content to display after a section'
                                        )}
                                        validateFields={[]}
                                        helpText={i18n.t(
                                            'HTML links and basic styling can be included'
                                        )}
                                        format={(value) =>
                                            typeof value === 'string'
                                                ? DOMPurify.sanitize(value)
                                                : value
                                        }
                                    />
                                </StandardFormField>
                            </div>
                        </SectionedFormSection>
                    </SectionedFormSections>
                    <div className={styles.errorNoticeWrapper}>
                        <DefaultFormErrorNotice />
                    </div>
                </div>
                <div>
                    <FormFooterWrapper>
                        <ButtonStrip>
                            <Button
                                primary
                                small
                                disabled={submitting}
                                type="button"
                                onClick={() => form.submit()}
                                loading={submitting}
                                dataTest="form-submit-button"
                            >
                                {i18n.t('Save section')}
                            </Button>
                            <Button
                                secondary
                                small
                                disabled={submitting}
                                onClick={onCancel}
                                dataTest="form-cancel-link"
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        </ButtonStrip>
                        <div className={styles.actionsInfo}>
                            <IconInfo16 />
                            <p>
                                {i18n.t(
                                    'Saving a section does not save other changes to the data set'
                                )}
                            </p>
                        </div>
                    </FormFooterWrapper>
                </div>
            </div>
            {greyFieldModalOpen && (
                <GreyFieldsModal
                    onClose={() => setGreyFieldModalOpen(false)}
                    categoryCombos={categoriesComboData?.categoryCombos}
                    dataElements={dataElementsInput.value}
                    input={greyFieldInput}
                />
            )}
        </>
    )
}
