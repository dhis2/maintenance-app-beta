import i18n from '@dhis2/d2-i18n'
import { Box, InputFieldFF } from '@dhis2/ui'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { StandardFormField } from '../../../../../components'
import {
    DataElementField,
    ExpressionField,
    TrackedEntityAttributeField,
} from '../../../fields'

export function messageActionFields(
    programId: string,
    isWarning: boolean
): ReactNode {
    const deLabel = isWarning
        ? i18n.t('Data element to display warning next to')
        : i18n.t('Data element to display error next to')
    const teaLabel = isWarning
        ? i18n.t('Tracked entity attribute to display warning next to')
        : i18n.t('Tracked entity attribute to display error next to')
    return (
        <>
            <StandardFormField>
                <DataElementField programId={programId} label={deLabel} />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={teaLabel}
                />
            </StandardFormField>
            <StandardFormField>
                <Field name="content" label={i18n.t('Static text')} required>
                    {({ input, meta }) => (
                        <Box width="400px" minWidth="100px">
                            <InputFieldFF
                                input={input}
                                meta={meta}
                                label={i18n.t('Static text')}
                                required
                            />
                        </Box>
                    )}
                </Field>
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t(
                        'Expression to evaluate and display after static text.'
                    )}
                />
            </StandardFormField>
        </>
    )
}
