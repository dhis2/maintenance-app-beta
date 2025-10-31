import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    CodeField,
    DescriptionField,
    ModelTransferField,
    NameField,
    SectionedFormSection,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    ValueTypeField,
} from '../../../components'
import { SECTIONS_MAP, useBoundResourceQueryFn } from '../../../lib'
import { TrackedEntityAttribute } from '../../../types/generated'
import {
    AggregationTypeField,
    ConfidentialField,
    FieldMaskField,
    FormNameField,
    InheritField,
    OptionSetField,
    PatternField,
    TrackedEntityTypeField,
    UniqueRadioFields,
} from '../fields'

export const TrackedEntityAttributeFormFields = ({
    basicSectionName,
    dataCollectionSectionName,
    dataHandlingSectionName,
    legendsSectionName,
}: {
    basicSectionName: string
    dataCollectionSectionName: string
    dataHandlingSectionName: string
    legendsSectionName: string
}) => {
    const section = SECTIONS_MAP.trackedEntityAttribute
    const { input: valueTypeInput } = useField('valueType')
    const { input: uniqueInput } = useField('unique')
    const { input: orgunitScopeInput } = useField('orgunitScope')
    const { input: generatedInput } = useField('generated')

    const queryFn = useBoundResourceQueryFn()
    const systemInfoQuery = useQuery({
        queryKey: [
            { resource: 'system/info', params: { fields: 'encryption' } },
        ] as const,
        queryFn: queryFn<{ encryption: boolean }>,
    })
    const systemInfo = systemInfoQuery.data

    const valueType = valueTypeInput.value
    const isUnique = uniqueInput.value
    const isOrgunitScope = orgunitScopeInput.value
    const isGenerated = generatedInput.value
    const encryptionEnabled = systemInfo?.encryption === true

    const showTrackedEntityType =
        valueType === TrackedEntityAttribute.valueType.TRACKER_ASSOCIATE

    const uniqueDisabled =
        valueType === TrackedEntityAttribute.valueType.TRACKER_ASSOCIATE ||
        valueType === TrackedEntityAttribute.valueType.USERNAME

    return (
        <>
            <SectionedFormSection name={basicSectionName}>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this tracked entity attribute.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <FormNameField />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Shown as help text when collecting data, use to provide more context and information'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name={dataCollectionSectionName}>
                <StandardFormSectionTitle>
                    {i18n.t('Data collection')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        "Configure how this tracked entity attribute's data is collected."
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <OptionSetField />
                </StandardFormField>

                <StandardFormField>
                    <ValueTypeField />
                </StandardFormField>

                {showTrackedEntityType && (
                    <StandardFormField>
                        <TrackedEntityTypeField />
                    </StandardFormField>
                )}

                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        dataTest="formfields-unique"
                        name="unique"
                        label={i18n.t('Data value must be unique')}
                        type="checkbox"
                        disabled={uniqueDisabled}
                        validateFields={[]}
                    />
                </StandardFormField>

                {isUnique && !uniqueDisabled && (
                    <StandardFormField>
                        <div style={{ marginLeft: '24px' }}>
                            <UniqueRadioFields />
                        </div>
                    </StandardFormField>
                )}

                {isUnique && !isOrgunitScope && (
                    <StandardFormField>
                        <FieldRFF
                            component={CheckboxFieldFF}
                            dataTest="formfields-generated"
                            name="generated"
                            label={i18n.t('Automatically generate values')}
                            type="checkbox"
                            validateFields={[]}
                        />
                    </StandardFormField>
                )}

                {isGenerated && (
                    <StandardFormField>
                        <div style={{ marginLeft: '24px' }}>
                            <PatternField />
                        </div>
                    </StandardFormField>
                )}

                <StandardFormField>
                    <FieldMaskField />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name={dataHandlingSectionName}>
                <StandardFormSectionTitle>
                    {i18n.t('Data handling')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        "Configure how this tracker entity attribute's values are displayed, inherited, or synchronized across the system."
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <ConfidentialField encryptionEnabled={encryptionEnabled} />
                </StandardFormField>

                <StandardFormField>
                    <InheritField />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        dataTest="formfields-displayInListNoProgram"
                        name="displayInListNoProgram"
                        label={i18n.t(
                            'Show in lists and search results even when a program is not selected'
                        )}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        dataTest="formfields-skipSynchronization"
                        name="skipSynchronization"
                        label={i18n.t(
                            "Do not synchronize this attribute and it's values"
                        )}
                        type="checkbox"
                        validateFields={[]}
                    />
                </StandardFormField>

                {/* TODO: Uncomment when version control is implemented (v43+) */}
                {/* <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        dataTest="formfields-trigramIndexable"
                        name="trigramIndexable"
                        label={i18n.t('Enable trigram indexing')}
                        type="checkbox"
                        helpText={i18n.t(
                            'Improves search performance for this attribute. Available in DHIS2 v43 and above.'
                        )}
                        validateFields={[]}
                    />
                </StandardFormField> */}

                <StandardFormField>
                    <AggregationTypeField />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name={legendsSectionName}>
                <StandardFormSectionTitle>
                    {i18n.t('Legends')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Legends assigned to this tracker entity attribute are used in data analysis apps.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <ModelTransferField
                        dataTest="legendSets-field"
                        name="legendSets"
                        query={{
                            resource: 'legendSets',
                            params: {
                                fields: ['id', 'displayName'],
                            },
                        }}
                        leftHeader={i18n.t('Available legends')}
                        rightHeader={i18n.t('Selected legends')}
                        filterPlaceholder={i18n.t('Search available legends')}
                        filterPlaceholderPicked={i18n.t(
                            'Search selected legends'
                        )}
                        enableOrderChange={true}
                        maxSelections={Infinity}
                    />
                </StandardFormField>
            </SectionedFormSection>
        </>
    )
}
