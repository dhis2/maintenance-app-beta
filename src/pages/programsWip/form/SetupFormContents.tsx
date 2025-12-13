import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import {
    CodeField,
    DescriptionField,
    EditableFieldWrapper,
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

const featureTypes = [
    {
        value: '',
        label: i18n.t('<No value>'),
    },
    {
        value: 'NONE',
        label: i18n.t('None'),
    },
    {
        value: 'POINT',
        label: i18n.t('Point'),
    },
    {
        value: 'POLYGON',
        label: i18n.t('Polygon'),
    },
]
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
    const { input: versionInput, meta: versionMeta } = useField('version', {
        type: 'number',
        format: (value) => value?.toString(),
        validate: (value) =>
            value < versionMeta.initial
                ? i18n.t('Should not be lower than previous version')
                : undefined,
    })

    const { input: featureTypeInput, meta: featureTypeMeta } =
        useField('featureType')
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
                <InputFieldFF
                    input={versionInput}
                    meta={versionMeta}
                    inputWidth="100px"
                    dataTest="formfields-version"
                    label={i18n.t('Version')}
                    helpText={
                        values.lastUpdated
                            ? i18n.t(
                                  'Last updated:  {{date}}',

                                  {
                                      date: defaultDateTimeFormatter.format(
                                          fromServerDate(values.lastUpdated)
                                      ),
                                      nsSeparator: '~:~',
                                  }
                              )
                            : undefined
                    }
                />
            </StandardFormField>
            <StandardFormField>
                <SingleSelectFieldFF
                    name="featureType"
                    label={i18n.t('Feature type')}
                    inputWidth="400px"
                    options={featureTypes}
                    input={featureTypeInput}
                    meta={featureTypeMeta}
                />
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
        </SectionedFormSection>
    )
})
