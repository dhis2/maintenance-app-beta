import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import {
    composeAsyncValidators,
    useIsFieldValueUnique,
    useValidator,
} from '../../../../../lib'
import { stageSchemaSection } from '../StageForm'

export function StageNameField() {
    const { values } = useFormState({ subscription: { values: true } })

    const checkDuplicateName = useIsFieldValueUnique({
        model: 'programStages',
        field: 'name',
        id: values.id,
        message: i18n.t(
            'A stage with this name already exists. Please choose another name.'
        ),
    })

    const baseNameValidator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'name',
    })

    const nameValidator = useMemo(
        () =>
            composeAsyncValidators<string>([
                baseNameValidator,
                checkDuplicateName,
            ]),
        [baseNameValidator, checkDuplicateName]
    )

    return (
        <FieldRFF
            name="name"
            component={InputFieldFF}
            validate={nameValidator}
            validateFields={[]}
            dataTest="formfields-name"
            required
            inputWidth="400px"
            label={i18n.t('Name')}
        />
    )
}
