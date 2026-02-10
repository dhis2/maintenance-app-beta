import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../../components'
import {
    DataElementWithOptionSetField,
    OptionGroupField,
    TrackedEntityAttributeWithOptionSetField,
} from '../../../../fields'

export function optionGroupFields(programId: string, label: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementWithOptionSetField
                    programId={programId}
                    label={i18n.t('Data element')}
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeWithOptionSetField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute')}
                />
            </StandardFormField>
            <StandardFormField>
                <OptionGroupField label={label} required />
            </StandardFormField>
        </>
    )
}
