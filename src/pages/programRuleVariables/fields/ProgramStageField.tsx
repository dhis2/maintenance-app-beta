import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { required } from '../../../lib'

export function ProgramStageField({
    onChange,
}: Readonly<{ onChange?: () => void }>) {
    const { input: programInput } = useField('program')
    const program = programInput.value

    if (!program?.id) {
        return null
    }

    return (
        <FieldRFF
            name="programStage"
            validate={required}
            render={({ input, meta }) => (
                <ModelSingleSelectField
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    dataTest="programStage-field"
                    label={i18n.t('Program stage')}
                    required
                    query={{
                        resource: 'programStages',
                        params: {
                            fields: ['id', 'displayName'],
                            filter: `program.id:eq:${program.id}`,
                            paging: false,
                        },
                    }}
                    onChange={onChange}
                />
            )}
        />
    )
}
