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
import { IndicatorMergeFormValues } from './indicatorMergeSchema'

export const IndicatorMergeFormFields = () => {
    return (
        <FormSections>
            <FormSection>
                <Description>
                    <p>
                        {i18n.t(`The merge operation will merge the source indicators into
                the target indicator. One or many source indicators
                can be specified`)}
                    </p>
                    <p>
                        {i18n.t(`Only one target should be specified. The merge operation will
                transfer all of the indicator metadata associations to the
                source indicator over to the target indicator.`)}
                    </p>
                </Description>
                <MergeSourcesTargetWrapper>
                    <BaseSourcesField
                        label={i18n.t('Indicators to be merged (source)')}
                        placeholder={i18n.t('Select indicators to merge')}
                        query={{
                            resource: 'indicators',
                            params: {
                                fields: ['id', 'displayName', 'name', 'factor'],
                            },
                        }}
                    />
                    <BaseTargetField
                        label={i18n.t('Indicators to merge into (target)')}
                        placeholder={i18n.t('Select indicator to merge into')}
                        query={{
                            resource: 'indicators',
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
                        'What should happen to the source indicators after the merge is complete?'
                    )}
                    getKeepLabel={(count) =>
                        i18n.t('Keep {{ count }} source indicators', {
                            count,
                        })
                    }
                    getDeleteLabel={(count) =>
                        i18n.t('Delete {{ count }} source indicators', {
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
    const { values } = useFormState<IndicatorMergeFormValues>({
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
