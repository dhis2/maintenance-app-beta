import i18n from '@dhis2/d2-i18n'
import React, { ReactNode } from 'react'
import { StandardFormField } from '../../../../../components'
import {
    ActionTextInputField,
    DataElementField,
    TrackedEntityAttributeField,
} from '../../../fields'

export function hideFieldFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementField
                    programId={programId}
                    label={i18n.t('Data element to hide')}
                    disableIfOtherFieldSet="trackedEntityAttribute"
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute to hide')}
                    disableIfOtherFieldSet="dataElement"
                />
            </StandardFormField>
            <StandardFormField>
                <ActionTextInputField
                    name="content"
                    label={i18n.t('Custom message for blanked field')}
                />
            </StandardFormField>
        </>
    )
}
