import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { HorizontalFieldGroup } from '..'

export function MissingValueStrategyField({
    objectName,
}: Readonly<{ objectName: 'leftSide' | 'rightSide' | 'generator' }>) {
    const neverSkipField = useField(`${objectName}.missingValueStrategy`, {
        type: 'radio',
        value: 'NEVER_SKIP',
    })
    const skipIfAnyField = useField(`${objectName}.missingValueStrategy`, {
        type: 'radio',
        value: 'SKIP_IF_ANY_VALUE_MISSING',
    })
    const skipIfAllField = useField(`${objectName}.missingValueStrategy`, {
        type: 'radio',
        value: 'SKIP_IF_ALL_VALUES_MISSING',
    })

    return (
        <HorizontalFieldGroup
            label={i18n.t('Missing value strategy')}
            dataTest={`formfields-missingValueStategy-${objectName}`}
        >
            <RadioFieldFF
                label={i18n.t('Never skip')}
                input={neverSkipField.input}
                meta={neverSkipField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Skip if any value is missing')}
                input={skipIfAnyField.input}
                meta={skipIfAnyField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Skip if all values are missing')}
                input={skipIfAllField.input}
                meta={skipIfAllField.meta}
            />
        </HorizontalFieldGroup>
    )
}
