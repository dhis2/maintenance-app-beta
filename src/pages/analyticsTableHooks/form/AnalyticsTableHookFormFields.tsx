import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF, SingleSelectFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field, useField } from 'react-final-form'
import {
    HorizontalFieldGroup,
    NameField,
    CodeField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { getConstantTranslation, SECTIONS_MAP, useSchema } from '../../../lib'
import { AnalyticsTableHook } from '../../../types/generated'

const section = SECTIONS_MAP.analyticsTableHook

const phaseOptions = [
    {
        value: AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED,
        label: i18n.t('Resource tables'),
    },
    {
        value: AnalyticsTableHook.phase.ANALYTICS_TABLE_POPULATED,
        label: i18n.t('Analytics tables'),
    },
]

export const AnalyticsTableHookFormFields = () => {
    const schema = useSchema(section.name)
    const { input: phaseInput } = useField<string | undefined>('phase', {
        subscription: { value: true },
    })
    const selectedPhase = phaseInput.value

    const resourceTableOptions =
        schema?.properties.resourceTableType?.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) ?? []

    const analyticsTableOptions =
        schema?.properties.analyticsTableType?.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) ?? []

    const showResourceTableField =
        selectedPhase === AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED
    const showAnalyticsTableField =
        selectedPhase === AnalyticsTableHook.phase.ANALYTICS_TABLE_POPULATED

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this analytics table hook.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>
                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
                <StandardFormField>
                    <HorizontalFieldGroup
                        label={i18n.t('Phase')}
                        required
                        dataTest="formfields-phase"
                    >
                        {phaseOptions.map((option) => (
                            <Field<string | undefined>
                                key={option.value}
                                name="phase"
                                component={RadioFieldFF}
                                label={option.label}
                                type="radio"
                                value={option.value}
                            />
                        ))}
                    </HorizontalFieldGroup>
                </StandardFormField>

                {showResourceTableField ? (
                    <StandardFormField>
                        <Field
                            component={SingleSelectFieldFF}
                            name="resourceTableType"
                            label={i18n.t('Which resource table')}
                            options={resourceTableOptions}
                            required
                            clearable
                            inputWidth="400px"
                            dataTest="formfields-resourceTableType"
                        />
                    </StandardFormField>
                ) : null}

                {showAnalyticsTableField ? (
                    <StandardFormField>
                        <Field
                            component={SingleSelectFieldFF}
                            name="analyticsTableType"
                            label={i18n.t('Which analytics table')}
                            options={analyticsTableOptions}
                            required
                            clearable
                            inputWidth="400px"
                            dataTest="formfields-analyticsTableType"
                        />
                    </StandardFormField>
                ) : null}
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Advanced')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure the SQL that should run for this hook.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <Field
                        component={TextAreaFieldFF}
                        name="sql"
                        label={i18n.t('SQL')}
                        required
                        inputWidth="400px"
                        dataTest="formfields-sql"
                    />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
