import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import {
    AggregationLevelMultiSelect,
    EditableFieldWrapper,
} from '../../../components'
import classes from './AggregationLevelsField.module.css'

/**
 *
 * AggregationLevels
 *
 */
export function AggregationLevelsField() {
    const newAggregationLevelLink = useHref('/organisationUnitLevel/new')
    const { input, meta } = useField('aggregationLevels', {
        multiple: true,
        format: (levels: number[]) => levels.map((level) => level.toString()),
        parse: (levels: string[]) => levels.map((level) => parseInt(level, 10)),
        validateFields: [],
    })
    const aggregationLevelHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="formfields-aggregationlevels"
            onRefresh={() => aggregationLevelHandle.current.refetch()}
            onAddNew={() => window.open(newAggregationLevelLink, '_blank')}
        >
            <div className={classes.aggregationLevelsMultiSelect}>
                <Field
                    name="aggregationLevels"
                    label={i18n.t('Aggregation level(s)')}
                    validationText={meta.touched ? meta.error : undefined}
                    error={meta.touched && !!meta.error}
                    dataTest="formfields-aggregationlevels"
                >
                    <AggregationLevelMultiSelect
                        ref={aggregationLevelHandle}
                        invalid={meta.touched && !!meta.error}
                        inputWidth="400px"
                        placeholder=""
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        onRetryClick={() =>
                            aggregationLevelHandle.current.refetch()
                        }
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}
