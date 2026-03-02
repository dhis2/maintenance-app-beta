import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import {
    DataElementWithOptionSetField,
    OptionField,
    TrackedEntityAttributeWithOptionSetField,
} from '../../../fields'

export function hideOption(programId: string): ReactNode {
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
                <OptionField label={i18n.t('Option to hide')} required />
            </StandardFormField>
        </>
    )
}
