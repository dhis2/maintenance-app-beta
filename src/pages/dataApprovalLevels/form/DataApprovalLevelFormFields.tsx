import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import {
    CodeField,
    NameField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
} from '../../../components'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { ModelSingleSelectRefreshableFormField } from '../../../components/metadataFormControls/ModelSingleSelect/ModelSingleSelectRefreshableField'
import { SECTIONS_MAP, required as requiredValidator } from '../../../lib'

function OrgUnitLevelField() {
    const { input, meta } = useField('orgUnitLevel', {
        validateFields: [],
        validate: requiredValidator,
        format: (level) =>
            level != null
                ? { id: level.toString(), displayName: '' }
                : undefined,
        parse: (selected) =>
            selected ? Number.parseInt(selected.id, 10) : undefined,
    })

    return (
        <ModelSingleSelectField
            required
            input={input}
            meta={meta}
            label={i18n.t('Organisation unit level')}
            dataTest="formfields-orgunitlevel"
            query={{
                resource: 'organisationUnitLevels',
                params: {
                    fields: ['displayName', 'level'],
                    order: ['level'],
                },
            }}
            transform={(values) =>
                values.map((value) => ({
                    ...value,
                    id: (
                        value as unknown as { level: number }
                    ).level.toString(),
                }))
            }
        />
    )
}

export default function DataApprovalLevelFormFields() {
    const section = SECTIONS_MAP.dataApprovalLevel
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>
                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Configuration')}
                </StandardFormSectionTitle>
                <StandardFormField>
                    <OrgUnitLevelField />
                </StandardFormField>
                <StandardFormField>
                    <ModelSingleSelectRefreshableFormField
                        name="categoryOptionGroupSet"
                        label={i18n.t('Category option group set')}
                        dataTest="formfields-categoryoptiongroupset"
                        query={{
                            resource: 'categoryOptionGroupSets',
                            params: {
                                fields: ['id', 'displayName'],
                                order: 'displayName:iasc',
                            },
                        }}
                        refreshResource="categoryOptionGroupSets"
                    />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
