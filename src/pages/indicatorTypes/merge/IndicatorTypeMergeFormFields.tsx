import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { StandardFormSectionTitle } from '../../../components'
import {
    BaseSourcesField,
    BaseTargetField,
    MergeSourcesTargetWrapper,
    DeleteSourcesFields,
    Description,
    FormSection,
    FormSections,
    ConfirmationField,
} from '../../../components/merge'
import { IndicatorTypeMergeFormValues } from './indicatorTypeMergeSchema'

export const IndicatorTypeMergeFormFields = () => {
    return (
        <FormSections>
            <FormSection>
                <Description>
                    <p>
                        {i18n.t(`The merge operation will merge the source indicator types into
                the target indicator type. One or many source indicator types
                can be specified`)}
                    </p>
                    <p>
                        {i18n.t(`Only one target should be specified. The merge operation will
                transfer all of the indicator metadata associations to the
                source indicator types over to the target indicator type.`)}
                    </p>
                </Description>
                <MergeSourcesTargetWrapper>
                    <BaseSourcesField
                        label={i18n.t('Indicator types to be merged (source)')}
                        placeholder={i18n.t('Select indicator types to merge')}
                        query={{
                            resource: 'indicatorTypes',
                            params: {
                                fields: ['id', 'displayName', 'name', 'factor'],
                            },
                        }}
                    />
                    <BaseTargetField
                        label={i18n.t('Indicator type to merge into (target)')}
                        placeholder={i18n.t(
                            'Select indicator type to merge into'
                        )}
                        query={{
                            resource: 'indicatorTypes',
                            params: {
                                fields: ['id', 'displayName', 'name', 'factor'],
                            },
                        }}
                    />
                </MergeSourcesTargetWrapper>
            </FormSection>
            <FormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Merge settings')}
                </StandardFormSectionTitle>

                <DeleteSourcesFields
                    groupLabel={i18n.t(
                        'What should happen to the source indicator types after the merge is complete?'
                    )}
                    getKeepLabel={(count) =>
                        i18n.t('Keep {{ count }} source indicator types', {
                            count,
                        })
                    }
                    getDeleteLabel={(count) =>
                        i18n.t('Delete {{ count }} source indicator types', {
                            count,
                        })
                    }
                />
            </FormSection>
            <FormSection>
                <ConfirmationField />
            </FormSection>
            <MergeWarnings />
        </FormSections>
    )
}

const MergeWarnings = () => {
    const { values } = useFormState<IndicatorTypeMergeFormValues>({
        subscription: { values: true },
    })

    if (values.sources?.length === 0 || !values.target) {
        return null
    }

    const sourcesWithDifferentFactors =
        values.sources?.filter((s) => s.factor !== values.target.factor) || []
    if (sourcesWithDifferentFactors.length > 0) {
        return (
            <div style={{ maxWidth: 640 }}>
                <NoticeBox warning title={i18n.t('Conflicting factors')}>
                    {i18n.t(
                        'The following source indicator types have different factors than the target indicator type with factor {{ targetFactor }}:',
                        { targetFactor: values.target.factor }
                    )}
                    <ul>
                        {sourcesWithDifferentFactors.map((s) => (
                            <li key={s.id}>{s.displayName ?? s.id}</li>
                        ))}
                    </ul>
                    {i18n.t(
                        'It is not recommended to merge indicator types with different factors.'
                    )}
                </NoticeBox>
            </div>
        )
    }

    return null
}
