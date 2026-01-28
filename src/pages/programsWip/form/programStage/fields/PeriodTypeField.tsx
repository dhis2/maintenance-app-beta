import i18n from '@dhis2/d2-i18n'
import { Box, Field as UIField } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { PeriodTypeSelect } from '../../../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'

export function PeriodTypeField() {
    return (
        <FieldRFF
            name="periodType"
            render={({ input, meta }) => (
                <UIField
                    name="periodType"
                    label={i18n.t('Period type')}
                    error={meta.touched && !!meta.error}
                    validationText={meta.touched ? meta.error : undefined}
                >
                    <Box width="400px" minWidth="100px">
                        <PeriodTypeSelect
                            selected={input.value}
                            invalid={meta.touched && !!meta.error}
                            onChange={input.onChange}
                            noValueOption
                            dataTest="formfields-periodType"
                        />
                    </Box>
                </UIField>
            )}
        />
    )
}
