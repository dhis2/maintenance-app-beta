import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import {
    CodeField,
    DescriptionField,
    FormFooterWrapper,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormActions,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    TransferHeader,
} from '../../../../../components'
import { BaseModelTransfer } from '../../../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import {
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
} from '../../../../../lib'
import { PickWithFieldFilters, Section } from '../../../../../types/generated'
import { DisplayableModel } from '../../../../../types/models'
import styles from './DataSetSectionFormContents.module.css'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'indicators',
    'showRowTotals',
    'displayOptions',
    'dataElements[id,displayName]',
]

const dataSetSectionSchemaSection = {
    name: SchemaName.section,
    namePlural: 'sections',
    title: i18n.t('Section'),
    titlePlural: i18n.t('Sections'),
    parentSectionKey: 'dataSet',
} satisfies SchemaSection

export type SectionFormValues = PickWithFieldFilters<
    Section,
    typeof fieldFilters
>

export type DataSetSectionFormProps = {
    onCancel?: () => void
}

type DataSetDataElementsType = {
    dataSetElements: {
        dataElement: {
            id: string
            displayName: string
        }
    }[]
    sections: { dataElements: { id: string }[] }[]
    indicators: { id: string; displayName: string }[]
}

export const DataSetSectionFormContents = ({
    onCancel,
}: DataSetSectionFormProps) => {
    const form = useForm<SectionFormValues>()
    const { submitting, values } = useFormState({
        subscription: { submitting: true, values: true },
    })

    const { input: dataElementsInput, meta: dataElementsMeta } = useField<
        DisplayableModel[]
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

    const queryFn = useBoundResourceQueryFn()
    const { data, isLoading } = useQuery({
        queryFn: queryFn<DataSetDataElementsType>,
        queryKey: [
            {
                resource: 'dataSets',
                id: values.dataSet.id,
                params: {
                    fields: [
                        'dataSetElements[dataElement[id,displayName]]',
                        'indicators[id,displayName]',
                        'sections[dataElements]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const availableDataElements = useMemo(() => {
        if (!data) {
            return []
        }
        const sectionsDataElements = data?.sections.flatMap((section) =>
            section.dataElements?.map((de) => de.id)
        )
        return data.dataSetElements
            .map((de) => de.dataElement)
            .filter((de) => !sectionsDataElements.includes(de.id))
    }, [data])

    return (
        <div className={styles.sectionsWrapper}>
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
                                <TransferHeader>
                                    {i18n.t('Available data elements')}
                                </TransferHeader>
                            }
                            rightHeader={
                                <TransferHeader>
                                    {i18n.t('Selected data elements')}
                                </TransferHeader>
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
                            available={availableDataElements}
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
                </SectionedFormSection>
            </SectionedFormSections>
            <div>
                <FormFooterWrapper>
                    <StandardFormActions
                        submitLabel={i18n.t('Save section')}
                        onSubmitClick={() => form.submit()}
                        onCancelClick={onCancel}
                        submitting={submitting}
                    />
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
    )
}
