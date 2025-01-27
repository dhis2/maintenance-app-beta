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

export const CategoryOptionMergeFormFields = () => {
    return (
        <FormSections>
            <FormSection>
                <Description>
                    <p>
                        {i18n.t(`The merge operation will merge the source category options into
                the target category options. One or many source category options
                can be specified`)}
                    </p>
                    <p>
                        {i18n.t(`Only one target should be specified. The merge operation will
                transfer all of the category options metadata associations to the
                source category option  over to the target category option.`)}
                    </p>
                </Description>
                <MergeSourcesTargetWrapper>
                    <BaseSourcesField
                        label={i18n.t('Category options to be merged (source)')}
                        placeholder={i18n.t('Select category options to merge')}
                        query={{
                            resource: 'categoryOptions',
                            params: {
                                fields: ['id', 'displayName', 'name'],
                            },
                        }}
                    />
                    <BaseTargetField
                        label={i18n.t(
                            'Category options to merge into (target)'
                        )}
                        placeholder={i18n.t(
                            'Select category options to merge into'
                        )}
                        query={{
                            resource: 'categoryOptions',
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
                        'What should happen to the source category options after the merge is complete?'
                    )}
                    getKeepLabel={(count) =>
                        i18n.t('Keep {{ count }} source category options', {
                            count,
                        })
                    }
                    getDeleteLabel={(count) =>
                        i18n.t('Delete {{ count }} source category options', {
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
