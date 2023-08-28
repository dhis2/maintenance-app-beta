import i18n from '@dhis2/d2-i18n'
import {
    InputFieldFF,
    SingleSelectFieldFF,
    MultiSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import { CustomAttributes } from './CustomAttributes'
import { ColorAndIconField, DomainField, LegendSetField } from './customFields'
import { EditableFieldWrapper } from './EditableFieldWrapper'
import {
    useAddAggregationLevelMutation,
    useAddCategoryComboMutation,
    useAddLegendMutation,
    useAddCommentOptionSetMutation,
    useAddOptionSetMutation,
    useAggregationLevelsQuery,
    useCategoryCombosQuery,
    useCustomAttributesQuery,
    useCommentOptionSetsQuery,
    useOptionSetsQuery,
} from './hooks'

export function DataElementForm() {
    const customAttributes = useCustomAttributesQuery()
    const categoryCombos = useCategoryCombosQuery()
    const optionSets = useOptionSetsQuery()
    const commentOptionSets = useCommentOptionSetsQuery()
    const aggregationLevels = useAggregationLevelsQuery()

    const [addingCategoryCombo, setAddingCategoryCombo] = useState(false)
    const [addingOptionSet, setAddingOptionSet] = useState(false)
    const [addingCommentOptionSet, setAddingCommentOptionSet] = useState(false)
    const [addingAggregationLevel, setAddingAggregationLevel] = useState(false)

    // @TODO(DataElementForm): Use these
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [addLegend] = useAddLegendMutation()
    const [addCategoryCombo] = useAddCategoryComboMutation()
    const [addOptionSet] = useAddOptionSetMutation()
    const [addCommentOptionSet] = useAddCommentOptionSetMutation()
    const [addAggregationLevel] = useAddAggregationLevelMutation()
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const loading =
        categoryCombos.loading ||
        optionSets.loading ||
        commentOptionSets.loading ||
        aggregationLevels.loading ||
        customAttributes.loading
    const error =
        categoryCombos.error ||
        optionSets.error ||
        commentOptionSets.error ||
        aggregationLevels.error ||
        customAttributes.error

    if (loading) {
        return <>@TODO(DataElementForm): Loading</>
    }

    if (error) {
        return (
            <>
                @TODO(DataElementForm): Error
                <br />
                {error.toString()}
            </>
        )
    }

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the information for this data element')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        required
                        inputWidth="400px"
                        label={i18n.t('Name (required)')}
                        name="name"
                        helpText={i18n.t(
                            'A data element name should be concise and easy to recognize.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        required
                        inputWidth="400px"
                        name="shortName"
                        label={i18n.t('Short name (required)')}
                        helpText={i18n.t(
                            'Often used in reports where space is limited'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="150px"
                        name="code"
                        label={i18n.t('Code')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={TextAreaFieldFF}
                        inputWidth="400px"
                        name="description"
                        label={i18n.t('Description')}
                        helpText={i18n.t(
                            "Explain the purpose of this data element and how it's measured."
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="url"
                        label={i18n.t('Url')}
                        helpText={i18n.t(
                            'A web link that provides extra information'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="fieldMask"
                        label={i18n.t('Field mask')}
                        helpText={i18n.t(
                            'Use a pattern to limit what information can be entered.'
                        )}
                        placeholder={i18n.t('e.g. 999-000-0000')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="formName"
                        label={i18n.t('StandardForm name')}
                        helpText={i18n.t(
                            'An alternative name used in section or automatic data entry forms.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <DomainField />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={SingleSelectFieldFF}
                        required
                        inputWidth="400px"
                        name="valueType"
                        label={i18n.t('Value type (required)')}
                        helpText={i18n.t(
                            'The type of data that will be recorded.'
                        )}
                        options={[{ value: 'NUMBER', label: 'Number' }]}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        required
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        name="aggregationType"
                        label={i18n.t('Aggretation type (required)')}
                        helpText={i18n.t(
                            'The default way to aggregate this data element in analytics.'
                        )}
                        options={[{ value: 'SUM', label: 'Sum' }]}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Disaggregation and Option sets')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up disaggregation and predefined options.')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <EditableFieldWrapper
                        onRefresh={categoryCombos.refetch}
                        onAddNew={() => setAddingCategoryCombo(true)}
                    >
                        <FieldRFF
                            required
                            component={SingleSelectFieldFF}
                            name="categoryCombo"
                            inputWidth="400px"
                            label={i18n.t('Category combination (required)')}
                            helpText={i18n.t(
                                'Choose how this data element is disaggregated'
                            )}
                            options={categoryCombos.data}
                        />
                    </EditableFieldWrapper>
                </StandardFormField>

                <StandardFormField>
                    <EditableFieldWrapper
                        onRefresh={optionSets.refetch}
                        onAddNew={() => setAddingOptionSet(true)}
                    >
                        <FieldRFF
                            required
                            component={SingleSelectFieldFF}
                            name="optionSet"
                            inputWidth="400px"
                            options={optionSets.data}
                            label={i18n.t('Option set')}
                            helpText={i18n.t(
                                'Choose a set of predefined options for data entry'
                            )}
                        />
                    </EditableFieldWrapper>
                </StandardFormField>

                <StandardFormField>
                    <EditableFieldWrapper
                        onRefresh={commentOptionSets.refetch}
                        onAddNew={() => setAddingCommentOptionSet(true)}
                    >
                        <FieldRFF
                            required
                            component={SingleSelectFieldFF}
                            name="commentOptionSet"
                            inputWidth="400px"
                            options={commentOptionSets.data}
                            label={i18n.t('Option set comment')}
                            helpText={i18n.t(
                                'Choose a set of predefined comment for data entry'
                            )}
                        />
                    </EditableFieldWrapper>
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('LegendSet')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Visualize values for this data element in Analytics app. Multiple legendSet can be applied.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <LegendSetField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Aggregation levels')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {`
                        @TODO(DataElementForm): Help text to describe the aggregation levels
                          functionality. It appears as if this section hasn't been
                          finalized yet by Joe, so I guess we'll have to talk about
                          this particluar part.
                    `}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <EditableFieldWrapper
                        onRefresh={aggregationLevels.refetch}
                        onAddNew={() => setAddingAggregationLevel(true)}
                    >
                        <FieldRFF
                            required
                            component={MultiSelectFieldFF}
                            name="aggregationLevels"
                            inputWidth="400px"
                            options={commentOptionSets.data}
                            label={i18n.t('Aggregation level(s)')}
                            helpText={i18n.t(
                                'Choose how this data element is disaggregated'
                            )}
                        />
                    </EditableFieldWrapper>
                </StandardFormField>
            </StandardFormSection>

            {customAttributes.data?.length && (
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        {i18n.t('Custom attributes')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Custom fields for your DHIS2 instance')}
                    </StandardFormSectionDescription>

                    <CustomAttributes
                        attributes={customAttributes.data || []}
                    />
                </StandardFormSection>
            )}

            {addingCategoryCombo &&
                `@TODO(DataElementForm): add Modal(?) for adding a new category combo`}
            {addingOptionSet &&
                `@TODO(DataElementForm): add Modal(?) for adding a new option set`}
            {addingCommentOptionSet &&
                `@TODO(DataElementForm): add Modal(?) for adding a new option set combo`}
            {addingAggregationLevel &&
                `@TODO(DataElementForm): add Modal(?) for adding a new aggregation level`}
        </>
    )
}
