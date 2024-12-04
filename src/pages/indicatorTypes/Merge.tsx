import { useDataEngine } from '@dhis2/app-runtime'
import { FORM_ERROR } from 'final-form'
import React, { useMemo } from 'react'
import { StandardFormSectionTitle } from '../../components'
import { DefaultMergeFormContents, MergeFormBase } from '../../components/merge'
import { getDefaults, useLocationWithState } from '../../lib'
import { IndicatorTypeMergeForm } from './merge/IndicatorTypeMerge'
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
            const res = await dataEngine.mutate({
                resource: 'indicatorTypes/merge',
                type: 'create',
                data,
            })
            return undefined
        } catch (e) {
            console.error(e)
            return { [FORM_ERROR]: (e as Error).toString() }
        }
    }

    return (
        <MergeFormBase
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            <DefaultMergeFormContents
                title={
                    <StandardFormSectionTitle>
                        Configure indicator type merge
                    </StandardFormSectionTitle>
                }
            >
                <IndicatorTypeMergeForm />
            </DefaultMergeFormContents>
        </MergeFormBase>
    )
}
