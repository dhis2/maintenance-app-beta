import i18n from '@dhis2/d2-i18n'
import React from 'react'
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
                source indicators over to the target indicator.`)}
                    </p>
                </Description>
                <MergeSourcesTargetWrapper>
                    <BaseSourcesField
                        label={i18n.t('Indicators to be merged (source)')}
                        placeholder={i18n.t('Select indicators to merge')}
                        query={{
                            resource: 'indicators',
                            params: {
                                fields: ['id', 'displayName', 'name'],
                            },
                        }}
                    />
                    <BaseTargetField
                        label={i18n.t('Indicator to merge into (target)')}
                        placeholder={i18n.t('Select indicator to merge into')}
                        query={{
                            resource: 'indicators',
                            params: {
                                fields: ['id', 'displayName', 'name'],
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
        </FormSections>
    )
}
