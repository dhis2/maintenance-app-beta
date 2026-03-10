import i18n from '@dhis2/d2-i18n'
import { FieldGroup, Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'

export function DisplayFrontPageListField() {
    const { input } = useField<boolean>('displayFrontPageList', {
        validateFields: [],
    })

    const handleChange = (value: boolean) => {
        input.onChange(value)
        input.onBlur()
    }

    return (
        <FieldGroup label={i18n.t('Start page in web Capture app')}>
            <Radio
                checked={input.value !== true}
                value="search"
                label={i18n.t('Search form')}
                onChange={() => handleChange(false)}
                dataTest="formfields-displayFrontPageList-search"
            />
            <Radio
                checked={input.value === true}
                value="list"
                label={i18n.t('List of enrolled tracked entities')}
                onChange={() => handleChange(true)}
                dataTest="formfields-displayFrontPageList-list"
            />
        </FieldGroup>
    )
}
