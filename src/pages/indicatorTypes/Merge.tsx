import { useDataEngine } from '@dhis2/app-runtime'
import { Card } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { StandardFormSectionTitle } from '../../components'
import { MergeFormBase } from '../../components/merge'
import { getDefaults, useLocationWithState } from '../../lib'
import { IndicatorTypeMergeForm } from './merge/IndicatorTypeMerge'
import {
    IndicatorTypeMergeFormValues,
    mergeFormSchema,
    validate,
} from './merge/indicatorTypeMergeSchema'
import { Form } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

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
                    // placeholder for displayName, select will load labels
                    displayName: 'Loading...',
                })
            ),
        }

        return defaults
    }, [location.state?.selectedModels])

    const onSubmit = async (values: IndicatorTypeMergeFormValues) => {
        try {
            const res = await dataEngine.mutate({
                resource: 'indicatorTypes/merge',
                type: 'create',
                data: {
                    target: values.target.id,
                    sources: values.sources.map(({ id }) => id),
                    deleteSources: values.deleteSources === 'delete',
                },
            })
        } catch (e) {
            console.error(e)
            return { [FORM_ERROR]: e.toString() }
        }
    }

    return (
        <MergeFormBase
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            <StandardFormSectionTitle>
                Configure indicator type merge
            </StandardFormSectionTitle>
            <IndicatorTypeMergeForm />
        </MergeFormBase>
    )
}
