import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field, Form } from 'react-final-form'
import { z } from 'zod'
import { ModelTransferField } from '../../../components'
import { HorizontalFieldGroup } from '../../../components/form'
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
                    <ModelTransferField
                        name="sources"
                        query={{
                            resource: 'indicatorTypes',
                            params: {
                                fields: 'id,displayName',
                                filter: values.target
                                    ? `id:!in:[${values.target}]`
                                    : [],
                            },
                        }}
                        label="Source indicator types"
                    />
                    <ModelTransferField
                        name="target"
                        label="Target indicator type"
                        query={{
                            resource: 'indicatorTypes',
                            params: {
                                fields: 'id,displayName',
                                filter:
                                    values.sources.length > 0
                                        ? `id:!in:[${Array.from(
                                              values.sources.map((s) =>
                                                  typeof s === 'string'
                                                      ? s
                                                      : s.id
                                              )
                                          )}]`
                                        : [],
                            },
                        }}
                    />

                    <Field
                        component={CheckboxFieldFF}
                        name="deleteSources"
                        label={i18n.t('Delete source indicator types')}
                        type="checkbox"
                    />
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
