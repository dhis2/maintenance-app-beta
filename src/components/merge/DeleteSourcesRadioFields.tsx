import { FieldGroup, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field, useField } from 'react-final-form'
import { DisplayableModel } from '../../types/models'

type DeleteSourcesRadioFieldsProps = {
    // Admittedly, getters for labels is not very idomatic, but needed for reusable components
    // while keeping the i18n.t calls in the parent component
    groupLabel: string
    getKeepLabel: (count: number) => string
    getDeleteLabel: (count: number) => string
}

export const DeleteSourcesFields = ({
    groupLabel,
    getKeepLabel,
    getDeleteLabel,
}: DeleteSourcesRadioFieldsProps) => {
    const sourcesValues = useField<DisplayableModel[]>('sources', {
        subscription: { value: true },
    })
    // translate to a string, since radio only support string
    // note that the union with boolean in format-parameter is due to weird typings in Final Form
    const format = (value: boolean | string | undefined): string | undefined =>
        value || value === 'keep' ? 'keep' : 'delete'
    const parse = (value: string | undefined) => value === 'keep'

    const sourcesCnt = sourcesValues.input.value.length
    return (
        <>
            <FieldGroup label={groupLabel}>
                <Field
                    name="deleteSources"
                    component={RadioFieldFF}
                    label={getDeleteLabel(sourcesCnt)}
                    format={format}
                    parse={parse}
                    value={'delete'}
                    type="radio"
                />
                <Field
                    name="deleteSources"
                    component={RadioFieldFF}
                    label={getKeepLabel(sourcesCnt)}
                    format={format}
                    parse={parse}
                    value="keep"
                    type="radio"
                />
            </FieldGroup>
        </>
    )
}
