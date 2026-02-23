import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Field, IconAdd16, Input, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import {
    CodeField,
    DescriptionField,
    EditableFieldWrapper,
    FeatureTypeField,
    NameField,
    SectionedFormSection,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { defaultDateTimeFormatter } from '../../../components/date'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    DEFAULT_CATEGORYCOMBO_SELECT_OPTION,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { DisplayableModel } from '../../../types/models'
import classes from '../../dataElements/fields/CategoryComboField.module.css'
import {
    CompleteEventsExpiryDaysField,
    ExpiryDaysWithPeriodTypeField,
    OpenDaysAfterCoEndDateField,
} from './fields'
import setupClasses from './SetupFormContents.module.css'

const CATEGORY_COMBOS_QUERY = {
    resource: 'categoryCombos',
    params: {
        filter: ['dataDimensionType:eq:ATTRIBUTE'],
        fields: ['id', 'displayName', 'name'],
    },
}

const addDefaultCategoryComboTransform = <TCatCombo extends DisplayableModel>(
    catCombos: TCatCombo[]
) => [DEFAULT_CATEGORYCOMBO_SELECT_OPTION, ...catCombos]

export const SetupFormContents = React.memo(function SetupFormContents({
    name,
}: {
    name: string
}) {
    const { input: versionInput } = useField('version')
    const version = Number(versionInput.value) || 0

    const { values } = useFormState({ subscription: { values: true } })
    const refreshCategoryCombos = useRefreshModelSingleSelect({
        resource: 'categoryCombos',
    })
    const newCategoryComboLink = useHref('/categoryCombos/new')
    const { fromServerDate } = useTimeZoneConversion()
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Program Details')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Set up the basic information for this program.')}
            </StandardFormSectionDescription>
            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <ShortNameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <CodeField schemaSection={schemaSection} />
            </StandardFormField>
            <StandardFormField>
                <DescriptionField />
            </StandardFormField>
            <StandardFormField>
                <Field
                    label={i18n.t('Version')}
                    helpText={
                        values.lastUpdated
                            ? i18n.t('Last updated:  {{date}}', {
                                  date: defaultDateTimeFormatter.format(
                                      fromServerDate(values.lastUpdated)
                                  ),
                                  nsSeparator: '~:~',
                              })
                            : undefined
                    }
                >
                    <div className={setupClasses.versionFieldRow}>
                        <Input
                            value={String(version)}
                            disabled
                            width="100px"
                            dataTest="formfields-version"
                        />
                        <Button
                            small
                            icon={<IconAdd16 />}
                            onClick={() => versionInput.onChange(version + 1)}
                            dataTest="formfields-version-increment"
                            title={i18n.t('Increase version')}
                        />
                    </div>
                </Field>
            </StandardFormField>
            <StandardFormField>
                <FeatureTypeField />
            </StandardFormField>
            <StandardFormField>
                <ModelSingleSelectFormField
                    showNoValueOption
                    inputWidth="400px"
                    dataTest="formfields-relatedProgram"
                    name="relatedProgram"
                    label={i18n.t('Related program')}
                    query={{
                        resource: 'programs',
                        params: {
                            fields: ['id', 'displayName'],
                            order: ['displayName'],
                            filter: ['id:ne:' + values.id],
                        },
                    }}
                />
            </StandardFormField>
            <StandardFormField>
                <EditableFieldWrapper
                    onRefresh={() => refreshCategoryCombos()}
                    onAddNew={() => window.open(newCategoryComboLink, '_blank')}
                >
                    <div className={classes.categoryComboSelect}>
                        <ModelSingleSelectFormField
                            inputWidth={'400px'}
                            name="categoryCombo"
                            dataTest="formfields-categorycombo"
                            label={i18n.t('Category combination')}
                            helpText={i18n.t(
                                'Choose how this program is disaggregated.'
                            )}
                            query={CATEGORY_COMBOS_QUERY}
                            transform={addDefaultCategoryComboTransform}
                        />
                    </div>
                </EditableFieldWrapper>
            </StandardFormField>

            <StandardFormField>
                <ExpiryDaysWithPeriodTypeField />
            </StandardFormField>
            <StandardFormField>
                <CompleteEventsExpiryDaysField />
            </StandardFormField>
            <StandardFormField>
                <OpenDaysAfterCoEndDateField />
            </StandardFormField>
            <StandardFormField>
                <FieldRFF
                    name="minAttributesRequiredToSearch"
                    component={InputFieldFF}
                    type="number"
                    min="0"
                    inputWidth="200px"
                    label={i18n.t(
                        'Minimum number of attributes required to search'
                    )}
                    dataTest="formfields-minattributesrequiredtosearch"
                    format={(value: unknown) => {
                        if (value === undefined || value === null) {
                            return ''
                        }
                        if (
                            typeof value === 'number' ||
                            typeof value === 'string'
                        ) {
                            return String(value)
                        }
                        return ''
                    }}
                    parse={(value: unknown) => {
                        if (value === undefined || value === '') {
                            return 0
                        }
                        return Number.parseInt(value as string, 10)
                    }}
                />
            </StandardFormField>
            <StandardFormField>
                <FieldRFF
                    name="maxTeiCountToReturn"
                    component={InputFieldFF}
                    type="number"
                    min="0"
                    inputWidth="200px"
                    label={i18n.t(
                        'Maximum number of search results to display'
                    )}
                    helpText={i18n.t('Entering 0 shows all search results')}
                    dataTest="formfields-maxteicounttoreturn"
                    format={(value: unknown) => {
                        if (value === undefined || value === null) {
                            return ''
                        }
                        if (
                            typeof value === 'number' ||
                            typeof value === 'string'
                        ) {
                            return String(value)
                        }
                        return ''
                    }}
                    parse={(value: unknown) => {
                        if (value === undefined || value === '') {
                            return 0
                        }
                        return Number.parseInt(value as string, 10)
                    }}
                />
            </StandardFormField>
        </SectionedFormSection>
    )
})
