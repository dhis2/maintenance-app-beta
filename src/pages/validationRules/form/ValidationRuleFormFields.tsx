import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    Field as FieldUI,
    RadioFieldFF,
    SingleSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field, useField } from 'react-final-form'
import {
    CodeField,
    CustomAttributesSection,
    DescriptionField,
    HorizontalFieldGroup,
    ModelMultiSelectField,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'
import { PaddedContainer } from '../../../components/metadataFormControls/ExpressionBuilder/PaddedContainer'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'
import {
    getConstantTranslation,
    useSchema,
    useSchemaSectionHandleOrThrow,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { ValidationRuleFormDescriptor } from './formDescriptor'
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
                    <PeriodTypeFieldWrapper />
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

// Helper component for PeriodType field
const PeriodTypeFieldWrapper = () => {
    const { input, meta } = useField('periodType')

    return (
        <div className={css.fieldContainer}>
            <FieldUI
                name="periodType"
                label={i18n.t('Period type (required)')}
                required
                error={meta.touched && !!meta.error}
                validationText={meta.touched ? meta.error : undefined}
            >
                <PeriodTypeSelect
                    selected={input.value}
                    invalid={meta.touched && !!meta.error}
                    onChange={(selected: string) => input.onChange(selected)}
                />
            </FieldUI>
        </div>
    )
}

// Helper component for Missing Value Strategy field
function MissingValueStrategyField({
    side,
}: Readonly<{ side: 'leftSide' | 'rightSide' }>) {
    const neverSkipField = useField(`${side}.missingValueStrategy`, {
        type: 'radio',
        value: 'NEVER_SKIP',
    })
    const skipIfAnyField = useField(`${side}.missingValueStrategy`, {
        type: 'radio',
        value: 'SKIP_IF_ANY_VALUE_MISSING',
    })
    const skipIfAllField = useField(`${side}.missingValueStrategy`, {
        type: 'radio',
        value: 'SKIP_IF_ALL_VALUES_MISSING',
    })

    return (
        <HorizontalFieldGroup label={i18n.t('Missing value strategy')}>
            <RadioFieldFF
                label={i18n.t('Never skip')}
                input={neverSkipField.input}
                meta={neverSkipField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Skip if any value is missing')}
                input={skipIfAnyField.input}
                meta={skipIfAnyField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Skip if all values are missing')}
                input={skipIfAllField.input}
                meta={skipIfAllField.meta}
            />
        </HorizontalFieldGroup>
    )
}

// Helper component for Organisation Unit Levels field
const OrganisationUnitLevelsField = () => {
    const { input, meta } = useField('organisationUnitLevels', {
        multiple: true,
        format: (levels: number[]) => {
            return levels?.map((l) => ({
                id: l.toString(),
                displayName: l.toString(),
                level: l,
            }))
        },
        parse: (levels) => {
            return levels?.map((l: any) => parseInt(l.id, 10))
        },
        validateFields: [],
    })

    return (
        <div className={css.fieldContainer}>
            <ModelMultiSelectField
                input={input}
                meta={meta}
                name="organisationUnitLevels"
                label={i18n.t('Organisation unit levels to run validation for')}
                dataTest="formfields-organisationunitlevels"
                query={{
                    resource: 'organisationUnitLevels',
                    params: {
                        fields: ['displayName', 'level'],
                        order: ['displayName'],
                    },
                }}
                transform={(values: any[]) =>
                    values.map((value) => ({
                        ...value,
                        id: value.level.toString(),
                    }))
                }
            />
        </div>
    )
}

export default ValidationRuleFormFields
