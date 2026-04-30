import i18n from '@dhis2/d2-i18n'
import { FieldGroup, RadioFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useRef } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    DescriptionField,
    NameField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { SqlView } from '../../../types/generated'
import { AvailableVariablesPanel } from './AvailableVariablesPanel'
import { SqlEditorField } from './SqlEditorField'

type Mode = 'new' | 'edit'

const CACHE_STRATEGY_OPTIONS: {
    value: SqlView.cacheStrategy
    label: string
}[] = [
    {
        value: SqlView.cacheStrategy.RESPECT_SYSTEM_SETTING,
        label: i18n.t('Respect system setting'),
    },
    {
        value: SqlView.cacheStrategy.NO_CACHE,
        label: i18n.t('No cache'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_1_MINUTE,
        label: i18n.t('Cache for 1 minute'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_5_MINUTES,
        label: i18n.t('Cache for 5 minutes'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_10_MINUTES,
        label: i18n.t('Cache for 10 minutes'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_15_MINUTES,
        label: i18n.t('Cache for 15 minutes'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_30_MINUTES,
        label: i18n.t('Cache for 30 minutes'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_1_HOUR,
        label: i18n.t('Cache for 1 hour'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_6AM_TOMORROW,
        label: i18n.t('Cache until 6am tomorrow'),
    },
    {
        value: SqlView.cacheStrategy.CACHE_TWO_WEEKS,
        label: i18n.t('Cache for two weeks'),
    },
]

const SQL_TYPE_OPTIONS: {
    value: SqlView.type
    label: string
}[] = [
    {
        value: SqlView.type.VIEW,
        label: i18n.t(
            'View: SQL query is stored in the database, results are generated each time.'
        ),
    },
    {
        value: SqlView.type.MATERIALIZED_VIEW,
        label: i18n.t(
            'Materialized view: SQL query is stored and results are cached.'
        ),
    },
    {
        value: SqlView.type.QUERY,
        label: i18n.t(
            'Query only: Neither query nor results stored in the database. Supports inline ${variable} references.'
        ),
    },
]

const SqlTypeRadios = ({ disabled }: { disabled: boolean }) => {
    return (
        <FieldGroup
            label={i18n.t('SQL type')}
            helpText={
                disabled
                    ? i18n.t('SQL type cannot be changed after creation.')
                    : undefined
            }
            dataTest="formfields-type"
        >
            {SQL_TYPE_OPTIONS.map((option) => (
                <FieldRFF<string | undefined>
                    key={option.value}
                    component={RadioFieldFF}
                    name="type"
                    type="radio"
                    value={option.value}
                    label={option.label}
                    disabled={disabled}
                />
            ))}
        </FieldGroup>
    )
}

const SqlEditorWithVariables = () => {
    const editorRef = useRef<HTMLTextAreaElement>(null)
    const { input: typeInput } = useField<SqlView.type>('type', {
        subscription: { value: true },
    })
    const isQuery = typeInput.value === SqlView.type.QUERY
    return (
        <SqlEditorField
            name="sqlQuery"
            label={i18n.t('SQL query')}
            required
            editorRef={editorRef}
            helpText={i18n.t(
                'Only SELECT statements allowed. Sensitive tables, including user information, cannot be queried.'
            )}
            rightAddon={
                isQuery ? (
                    <AvailableVariablesPanel
                        fieldName="sqlQuery"
                        editorRef={editorRef}
                    />
                ) : null
            }
        />
    )
}

export const SqlViewFormFields = ({ mode }: { mode: Mode }) => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up how this SQL view is identified and described.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={SingleSelectFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Cache strategy')}
                        name="cacheStrategy"
                        options={CACHE_STRATEGY_OPTIONS}
                        helpText={i18n.t(
                            'Controls how long results are cached on the server before re-execution.'
                        )}
                        dataTest="formfields-cacheStrategy"
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('SQL definition')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Choose the type of SQL view and write the query.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <SqlTypeRadios disabled={mode === 'edit'} />
                </StandardFormField>
                <StandardFormField>
                    <SqlEditorWithVariables />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
