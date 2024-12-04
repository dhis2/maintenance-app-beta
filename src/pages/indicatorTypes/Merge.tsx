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
                })
            ),
        }

        return defaults
    }, [location.state?.selectedModels])

    const onSubmit = async (values: IndicatorTypeMergeFormValues) => {
        try {
            const data = mergeFormSchema.parse(values)
            const res = await dataEngine.mutate({
                resource: 'indicatorTypes/merge',
                type: 'create',
                data,
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
