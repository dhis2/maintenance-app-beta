import i18n from '@dhis2/d2-i18n'
import {
    InputFieldFF,
    SingleSelectFieldFF,
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
import {
    ColorAndIconField,
    DomainField,
    LegendsField,
} from './custom-fields'
import classes from './DataElementForm.module.css'
import { EditableFieldWrapper } from './EditableFieldWrapper'
import {
    useCategoryCombosQuery,
    useOptionSetsQuery,
    useOptionSetCommentsQuery,
    useLegendsQuery,
    useAddLegendMutation,
    useAddCategoryComboMutation,
    useAddOptionSetMutation,
    useAddOptionSetCommentMutation,
} from './hooks'

export function DataElementForm() {
    const categoryCombos = useCategoryCombosQuery()
    const optionSets = useOptionSetsQuery()
    const optionSetComments = useOptionSetCommentsQuery()
    const legends = useLegendsQuery()

    const [addingLegend, setAddingLegend] = useState(false)
    const [addingCategoryCombo, setAddingCategoryCombo] = useState(false)
    const [addingOptionSet, setAddingOptionSet] = useState(false)
    const [addingOptionSetComment, setAddingOptionSetComment] = useState(false)

    // @TODO(DataElementForm): Use these
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [addLegend] = useAddLegendMutation()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [addCategoryCombo] = useAddCategoryComboMutation()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [addOptionSet] = useAddOptionSetMutation()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [addOptionSetComment] = useAddOptionSetCommentMutation()

    if (
        categoryCombos.loading ||
        optionSets.loading ||
        optionSetComments.loading ||
        legends.loading
    ) {
        return <>@TODO(DataElementForm): Loading</>
    }

    if (
        categoryCombos.error ||
        optionSets.error ||
        optionSetComments.error ||
        legends.error
    ) {
        return <>@TODO(DataElementForm): Error</>
    }

    return (
        <>
            {addingLegend && `@TODO(DataElementForm): add Modal(?) for adding a new legend`}
            {addingCategoryCombo && `@TODO(DataElementForm): add Modal(?) for adding a new category combo`}
            {addingOptionSet && `@TODO(DataElementForm): add Modal(?) for adding a new option set`}
            {addingOptionSetComment && `@TODO(DataElementForm): add Modal(?) for adding a new option set combo`}

            <div className={classes.container}>
                <StandardFormSection>
                    <StandardFormSectionTitle>{i18n.t('Basic information')}</StandardFormSectionTitle>
                    <StandardFormSectionDescription>{i18n.t('Set up the information for this data element')}</StandardFormSectionDescription>

                    <StandardFormField>
                        <FieldRFF
                            component={InputFieldFF}
                            required
                            inputWidth="400px"
                            label={i18n.t('Name (required)')}
                            name="name"
                            helpText={i18n.t('A data element name should be concise and easy to recognize.')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (13)')}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            component={InputFieldFF}
                            required
                            inputWidth="400px"
                            name="shortName"
                            label={i18n.t('Short name (required)')}
                            helpText={i18n.t('Often used in reports where space is limited')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (14)')}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            component={InputFieldFF}
                            inputWidth="150px"
                            name="code"
                            label={i18n.t('Code')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (15)')}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            component={TextAreaFieldFF}
                            inputWidth="400px"
                            name="description"
                            label={i18n.t('Description')}
                            helpText={i18n.t("Explain the purpose of this data element and how it's measured.")}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            component={InputFieldFF}
                            inputWidth="400px"
                            name="url"
                            label={i18n.t('Url')}
                            helpText={i18n.t('A web link that provides extra information')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (17)')}
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
                            helpText={i18n.t('Use a pattern to limit what information can be entered.')}
                            placeholder={i18n.t('e.g. 999-000-0000')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (18)')}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            component={InputFieldFF}
                            inputWidth="400px"
                            name="formName"
                            label={i18n.t('StandardForm name')}
                            helpText={i18n.t('An alternative name used in section or automatic data entry forms.')}
                            value=""
                            onChange={() => alert('@TODO(DataElementForm): Implement me! (19)')}
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
                            helpText={i18n.t('The type of data that will be recorded.')}
                            options={[
                                { value: 'number', label: 'Number' },
                            ]}
                        />
                    </StandardFormField>

                    <StandardFormField>
                        <FieldRFF
                            required
                            component={SingleSelectFieldFF}
                            inputWidth="400px"
                            name="aggregationType"
                            label={i18n.t('Aggretation type (required)')}
                            helpText={i18n.t('The default way to aggregate this data element in analytics.')}
                            options={[{ value: 'sum', label: 'Sum' }]}
                        />
                    </StandardFormField>
                </StandardFormSection>

                <StandardFormSection>
                    <StandardFormSectionTitle>{i18n.t('Disaggregation and Option sets')}</StandardFormSectionTitle>
                    <StandardFormSectionDescription>{i18n.t('Set up disaggregation and predefined options.')}</StandardFormSectionDescription>

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
                                helpText={i18n.t('Choose how this data element is disaggregated')}
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
                                helpText={i18n.t('Choose a set of predefined options for data entry')}
                            />
                        </EditableFieldWrapper>
                    </StandardFormField>

                    <StandardFormField>
                        <EditableFieldWrapper
                            onRefresh={optionSetComments.refetch}
                            onAddNew={() => setAddingOptionSetComment(true)}
                        >
                            <FieldRFF
                                required
                                component={SingleSelectFieldFF}
                                name="optionSetComment"
                                inputWidth="400px"
                                options={optionSetComments.data}
                                label={i18n.t('Option set comment')}
                                helpText={i18n.t('Choose a set of predefined comment for data entry')}
                            />
                        </EditableFieldWrapper>
                    </StandardFormField>
                </StandardFormSection>

                <StandardFormSection>
                    <StandardFormSectionTitle>{i18n.t('Legends')}</StandardFormSectionTitle>
                    <StandardFormSectionDescription>{i18n.t('Visualize values for this data element in Analytics app. Multiple legends can be applied.')}</StandardFormSectionDescription>

                    <StandardFormField>
                        <LegendsField
                            options={legends.data}
                            onRefresh={legends.refetch}
                            onAddNew={() => setAddingLegend(true)}
                        />
                    </StandardFormField>
                </StandardFormSection>

                <StandardFormSection>
                    <StandardFormSectionTitle>{i18n.t('Aggregation levels')}</StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {`
                            @TODO(DataElementForm): Help text to describe the aggregation levels
                              functionality. It appears as if this section hasn't been
                              finalized yet by Joe, so I guess we'll have to talk about
                              this particluar part.
                        `}
                    </StandardFormSectionDescription>
                </StandardFormSection>
            </div>
        </>
    )
}
