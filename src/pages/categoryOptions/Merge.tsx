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
import {
    CategoryOptionMergeFormValues,
    mergeFormSchema,
    validate,
} from './merge/categoryOptionMergeSchema'
import { CategoryOptionMergeFormFields } from './merge/CategoryOptionMergeFormFields'

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

    const onSubmit = async (values: CategoryOptionMergeFormValues) => {
        try {
            const data = mergeFormSchema.parse(values)
            await dataEngine.mutate({
                resource: 'categoryOptions/merge',
                type: 'create',
                data,
            })
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
                                {i18n.t('Configure category options merge')}
                            </Title>
                        }
                        mergeCompleteElement={
                            <MergeComplete>
                                <p>
                                    {i18n.t(
                                        'The category options merge operation is complete.'
                                    )}
                                </p>
                                <p>
                                    {i18n.t(
                                        'All selected category options were merged successfully.'
                                    )}
                                </p>
                            </MergeComplete>
                        }
                    >
                        <CategoryOptionMergeFormFields />
                    </DefaultMergeFormContents>
                </StyledMergeForm>
            )}
        </Form>
    )
}
