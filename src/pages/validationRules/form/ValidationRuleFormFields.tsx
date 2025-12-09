import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    RadioFieldFF,
    SingleSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    CodeField,
    CustomAttributesSection,
    DescriptionField,
    HorizontalFieldGroup,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'
import {
    getConstantTranslation,
    useSchema,
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { ValidationRuleFormDescriptor } from './formDescriptor'
import { MissingValueStrategyField } from './MissingValueStrategyField'
import { OrganisationUnitLevelsField } from './OrganisationUnitLevelsField'
import { PeriodTypeField } from './PeriodTypeField'
import css from './ValidationRuleFormFields.module.css'

const ValidationRuleFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    const schema = useSchema(schemaSection.name)
    const descriptor =
        useSectionedFormContext<typeof ValidationRuleFormDescriptor>()
    useSyncSelectedSectionWithScroll()

    // Prepare operator options with "Not equal to" at the top
    const operatorOptions =
        schema.properties.operator.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) || []

    // Reorder to put "not_equal_to" at the top per requirements
    const notEqualToIndex = operatorOptions.findIndex(
        (opt) => opt.value === 'not_equal_to'
    )
    if (notEqualToIndex > 0) {
        const notEqualTo = operatorOptions.splice(notEqualToIndex, 1)[0]
        operatorOptions.unshift(notEqualTo)
    }

    const importanceOptions =
        schema.properties.importance.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) || []

    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor.getSection('basicInformation').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this validation rule.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <ShortNameField
                        schemaSection={schemaSection}
                        isRequired={false}
                    />
                </StandardFormField>
                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this validation rule.'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection
                name={descriptor.getSection('expressionsAndOutput').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Expressions and output')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the expressions and how they are compared.'
                    )}
                </StandardFormSectionDescription>

                <div className={css.expressionContainer}>
                    <PaddedContainer>
                        <div className={css.subtitle}>
                            {i18n.t('Left side expression (required)')}
                        </div>
                        <StandardFormField>
                            <p>
                                Placeholder for expression builder (left side)
                            </p>
                            {/* <ExpressionBuilderWithModalField
                            fieldName="leftSide.expression"
                            modalTitle={i18n.t('Edit left side expression')}
                            editButtonText={i18n.t('Edit left side expression')}
                            validationResource="validationRules/expression/description"
                        /> */}
                        </StandardFormField>

                        <StandardFormField>
                            <MissingValueStrategyField side="leftSide" />
                        </StandardFormField>

                        <StandardFormField>
                            <Field
                                name="leftSide.slidingWindow"
                                type="checkbox"
                                component={CheckboxFieldFF}
                                label={i18n.t(
                                    'Sliding window: validation checks against relative period'
                                )}
                            />
                        </StandardFormField>
                    </PaddedContainer>
                </div>

                <StandardFormField>
                    <Field
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Comparison operator (required)')}
                        name="operator"
                        required
                        options={operatorOptions}
                    />
                </StandardFormField>

                <div className={css.expressionContainer}>
                    <PaddedContainer>
                        <div className={css.subtitle}>
                            {i18n.t('Right side expression (required)')}
                        </div>
                        <StandardFormField>
                            <p>
                                Placeholder for expression builder (right side)
                            </p>
                            {/* <ExpressionBuilderWithModalField
                            fieldName="rightSide.expression"
                            modalTitle={i18n.t('Edit right side expression')}
                            editButtonText={i18n.t(
                                'Edit right side expression'
                            )}
                            validationResource="rightSide"
                        /> */}
                        </StandardFormField>

                        <StandardFormField>
                            <MissingValueStrategyField side="rightSide" />
                        </StandardFormField>

                        <StandardFormField>
                            <Field
                                name="rightSide.slidingWindow"
                                type="checkbox"
                                component={CheckboxFieldFF}
                                label={i18n.t(
                                    'Sliding window: validation checks against relative period'
                                )}
                            />
                        </StandardFormField>
                    </PaddedContainer>
                </div>

                <StandardFormField>
                    <Field
                        name="instruction"
                        inputWidth="400px"
                        component={TextAreaFieldFF}
                        label={i18n.t('Instruction to show')}
                        helpText={i18n.t(
                            'Instructions are shown when validating data in Data Entry and Android apps.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <PeriodTypeField />
                </StandardFormField>

                <StandardFormField>
                    <HorizontalFieldGroup
                        label={i18n.t('Importance')}
                        helpText={i18n.t(
                            'Changes the appearance of the validation rule output during Data Entry.'
                        )}
                    >
                        {importanceOptions.map((option) => (
                            <Field<string | undefined>
                                key={option.value}
                                name="importance"
                                component={RadioFieldFF}
                                label={option.label}
                                type="radio"
                                value={option.value}
                            />
                        ))}
                    </HorizontalFieldGroup>
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name={descriptor.getSection('options').name}>
                <StandardFormSectionTitle>
                    {i18n.t('Options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how, when, and where this validation rule runs.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <Field
                        name="skipFormValidation"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t(
                            'Skip this rule during form validation in Data Entry App'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <OrganisationUnitLevelsField />
                </StandardFormField>
            </SectionedFormSection>
            <CustomAttributesSection schemaSection={schemaSection} />
        </SectionedFormSections>
    )
}

export default ValidationRuleFormFields
