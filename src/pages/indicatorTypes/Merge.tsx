import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useMemo } from 'react'
import { StandardFormSectionTitle } from '../../components'
import {
    DefaultMergeFormContents,
    MergeComplete,
    MergeFormBase,
} from '../../components/merge'
import { getDefaults, useLocationWithState } from '../../lib'
import { createFormError } from '../../lib/form/createFormError'
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
            console.log({ res })
            return undefined
        } catch (e) {
            console.error(e)
            return createFormError(e)
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
                mergeCompleteElement={
                    <MergeComplete>
                        <p>
                            {i18n.t(
                                'The indicator types merge operation is complete.'
                            )}
                            <br /> <br />
                            {i18n.t(
                                'All selected indicator types were merged successfully.'
                            )}
                        </p>
                    </MergeComplete>
                }
            >
                <IndicatorTypeMergeForm />
            </DefaultMergeFormContents>
        </MergeFormBase>
    )
}
