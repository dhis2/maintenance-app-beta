import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import {
    CodeField,
    DescriptionField,
    FormBase,
    FormFooterWrapper,
    ModelTransferField,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormActions,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../../components'
import { LoadingSpinner } from '../../../../../components/loading/LoadingSpinner'
import {
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
} from '../../../../../lib'
import { PickWithFieldFilters, Section } from '../../../../../types/generated'
import { DisplayableModel } from '../../../../../types/models'

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
export const DataSetSectionFormContents = ({
    onCancel,
}: DataSetSectionFormProps) => {
    const form = useForm<SectionFormValues>()
    const { submitting } = useFormState({ subscription: { submitting: true } })
    return (
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
                    <NameField schemaSection={dataSetSectionSchemaSection} />
                    <CodeField schemaSection={dataSetSectionSchemaSection} />
                    <DescriptionField />
                </SectionedFormSection>
                <SectionedFormSection name="sectionDataElements">
                    <StandardFormSectionTitle>
                        {i18n.t('Section data elements')}
                    </StandardFormSectionTitle>
                    <ModelTransferField
                        name="dataElements"
                        query={{
                            resource: 'dataElements',
                            params: {
                                fields: ['id', 'displayName'],
                            },
                        }}
                    />
                </SectionedFormSection>
                <SectionedFormSection name="displayOptions">
                    <StandardFormSectionTitle>
                        {i18n.t('Display options')}
                    </StandardFormSectionTitle>
                </SectionedFormSection>
            </SectionedFormSections>
            <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <FormFooterWrapper>
                    <StandardFormActions
                        submitLabel={i18n.t('Save section')}
                        onSubmitClick={() => form.submit()}
                        onCancelClick={onCancel}
                        submitting={submitting}
                    />
                </FormFooterWrapper>
            </div>
        </div>
    )
}
