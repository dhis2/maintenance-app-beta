import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field, useField, useForm } from 'react-final-form'
import {
    HorizontalFieldGroup,
    StandardFormField,
} from '../../../components'
import { getConstantTranslation, SECTIONS_MAP, useSchema } from '../../../lib'
import { AnalyticsTableHook } from '../../../types/generated'

const section = SECTIONS_MAP.analyticsTableHook

export function PhaseField() {
    const form = useForm()
    const schema = useSchema(section.name)
    const { input: phaseInput } = useField<string | undefined>('phase', {
        subscription: { value: true },
    })
    const selectedPhase = phaseInput.value

    useEffect(() => {
        if (
            selectedPhase === AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED
        ) {
            form.change('analyticsTableType', undefined)
        }
        if (
            selectedPhase === AnalyticsTableHook.phase.ANALYTICS_TABLE_POPULATED
        ) {
            form.change('resourceTableType', undefined)
        }
    }, [selectedPhase, form])

    const phaseOptions =
        schema?.properties.phase?.constants?.map((constant) => ({
            value: constant,
            label: getConstantTranslation(constant),
        })) ?? []

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
        </>
    )
}
