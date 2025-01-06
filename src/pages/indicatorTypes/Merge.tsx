import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import {
    DefaultMergeFormContents,
    MergeComplete,
    StyledMergeForm,
    Title,
} from '../../components/merge'
import { getDefaults, useLocationWithState } from '../../lib'
import { createFormError } from '../../lib/form/createFormError'
import { IndicatorTypeMergeFormFields } from './merge/IndicatorTypeMergeFormFields'
import {
    IndicatorTypeMergeFormValues,
    mergeFormSchema,
    validate,
} from './merge/indicatorTypeMergeSchema'

export const Component = () => {
    const location = useLocationWithState<{ selectedModels: Set<string> }>()

    const dataEngine = useDataEngine()
    const initialValues = useMemo(() => {
        const defaults = {
            ...getDefaults(mergeFormSchema),
            target: undefined,
            sources: Array.from(location.state?.selectedModels || []).map(
                (id) => ({
                    id,
                })
            ),
        }
        return defaults
    }, [location.state?.selectedModels])

    const onSubmit = async (values: IndicatorTypeMergeFormValues) => {
        try {
            const data = mergeFormSchema.parse(values)
            const res = (await dataEngine.mutate({
                resource: 'indicatorTypes/merge',
                type: 'create',
                data,
            })) as any
            return undefined
        } catch (e) {
            console.error(e)
            return createFormError(e)
        }
    }

    return (
        <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            subscription={{
                values: false,
                submitting: true,
                submitSucceeded: true,
            }}
        >
            {({ handleSubmit }) => (
                <StyledMergeForm onSubmit={handleSubmit}>
                    <DefaultMergeFormContents
                        title={
                            <Title>
                                {i18n.t('Configure indicator type merge')}
                            </Title>
                        }
                        mergeCompleteElement={
                            <MergeComplete>
                                <p>
                                    {i18n.t(
                                        'The indicator types merge operation is complete.'
                                    )}
                                </p>
                                <p>
                                    {i18n.t(
                                        'All selected indicator types were merged successfully.'
                                    )}
                                </p>
                            </MergeComplete>
                        }
                    >
                        <IndicatorTypeMergeFormFields />
                    </DefaultMergeFormContents>
                </StyledMergeForm>
            )}
        </Form>
    )
}
