import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CheckboxFieldFF,
    FieldGroup,
    RadioFieldFF,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field, Form } from 'react-final-form'
import { z } from 'zod'
import {
    ModelTransferField,
    StandardFormSection,
    StandardFormSectionTitle,
} from '../../../components'
import { HorizontalFieldGroup } from '../../../components/form'
import {
    BaseSourcesField,
    BaseTargetField,
    MergeSourcesTargetWrapper,
} from '../../../components/merge'
import { ModelMultiSelectField } from '../../../components/metadataFormControls/ModelMultiSelect'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { ModelFilterSelect } from '../../../components/sectionList/filters/filterSelectors/ModelFilter'
import { getDefaults } from '../../../lib'
import { mergeFormSchema, validate } from './indicatorTypeMergeSchema'

type DataElementMergeFormProps = {
    selectedModels: { id: string; displayName: string }[]
}

type IndicatorTypeFormValues = z.infer<typeof mergeFormSchema>

export const IndicatorTypeMergeForm = ({
    selectedModels,
}: DataElementMergeFormProps) => {
    const dataEngine = useDataEngine()

    const initialValues = useMemo(() => {
        const defaults = {
            ...getDefaults(mergeFormSchema),
            sources: Array.from(selectedModels),
        }
        console.log({ defaults, selectedModels })
        return defaults
    }, [selectedModels])

    console.log({ initialValues })
    const onSubmit = async (values: IndicatorTypeFormValues) => {
        console.log({ values })

        return {}
    }

    return (
        <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            {({ handleSubmit, values }) => (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '16px',
                    }}
                >
                    <MergeSourcesTargetWrapper>
                        <BaseSourcesField
                            query={{
                                resource: 'indicatorTypes',
                                params: {
                                    fields: 'id,displayName',
                                    filter: values.target
                                        ? `id:!in:[${values.target}]`
                                        : [],
                                },
                            }}
                        />
                        <BaseTargetField
                            query={{
                                resource: 'indicatorTypes',
                                params: {
                                    fields: 'id,displayName',
                                },
                            }}
                        />
                    </MergeSourcesTargetWrapper>

                    <StandardFormSection>
                        <StandardFormSectionTitle>
                            {i18n.t('Merge settings')}
                        </StandardFormSectionTitle>

                        <FieldGroup
                            label={i18n.t(
                                'What should happen to the source indicator types after the merge is complete?'
                            )}
                        >
                            <Field<string | undefined>
                                component={RadioFieldFF}
                                name="deleteSources"
                                label={i18n.t(
                                    'Keep {{count}} source indicator types',
                                    { count: values.sources.length }
                                )}
                                type="radio"
                                value={'keep'}
                            />
                            <Field<string | undefined>
                                component={RadioFieldFF}
                                name="deleteSources"
                                label={i18n.t(
                                    'Delete {{count}} source indicator types',
                                    { count: values.sources.length }
                                )}
                                type="radio"
                                value={'delete'}
                            />
                        </FieldGroup>
                    </StandardFormSection>
                    <ButtonStrip>
                        <Button primary type="submit">
                            {i18n.t('Merge')}
                        </Button>
                        <Button secondary>{i18n.t('Cancel')}</Button>
                    </ButtonStrip>
                </form>
            )}
        </Form>
    )
}
