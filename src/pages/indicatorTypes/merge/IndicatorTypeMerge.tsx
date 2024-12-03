import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { z } from 'zod'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import {
    BaseSourcesField,
    BaseTargetField,
    MergeSourcesTargetWrapper,
} from '../../../components/merge'
import { DeleteSourcesFields } from '../../../components/merge/DeleteSourcesRadioFields'
import { mergeFormSchema } from './indicatorTypeMergeSchema'
import { useFormState } from 'react-final-form'

type DataElementMergeFormProps = {
    selectedModels: string[] // { id: string; displayName: string }[]
}

type IndicatorTypeFormValues = z.infer<typeof mergeFormSchema>

export const IndicatorTypeMergeForm = () => {
    const formState = useFormState()
    console.log({ formState })
    return (
        <>
            <StandardFormSectionDescription>
                The merge operation will merge the source indicator types into
                the target indicator type. One or many source indicator types
                can be specified.
                <br /> <br />
                Only one target should be specified. The merge operation will
                transfer all of the indicator metadata associations to the
                source indicator types over to the target indicator type.
            </StandardFormSectionDescription>
            <MergeSourcesTargetWrapper>
                <BaseSourcesField
                    label={i18n.t('Indicator types to be merged (source)')}
                    placeholder={i18n.t('Select indicator types to merge')}
                    query={{
                        resource: 'indicatorTypes',
                    }}
                />
                <BaseTargetField
                    label={i18n.t('Indicator type to merge into (target)')}
                    placeholder={i18n.t('Select indicator type to merge into')}
                    query={{
                        resource: 'indicatorTypes',
                    }}
                />
            </MergeSourcesTargetWrapper>

            <div>
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
            </div>
        </>
    )
}
