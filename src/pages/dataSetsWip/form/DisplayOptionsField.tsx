import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF, RadioFieldFF } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import classes from './DisplayOptionField.module.css'

export function DisplayOptionsField() {
    const fieldName = 'displayOptions'
    const titleField = useField(`${fieldName}.customText.header`, {
        validate: (value) => {
            return value?.length > 500
                ? i18n.t('Should not exceed {{maxLength}} characters', {
                      maxLength: 500,
                  })
                : false
        },
    })
    const subtitleField = useField(`${fieldName}.customText.subheader`, {
        validate: (value) => {
            return value?.length > 500
                ? i18n.t('Should not exceed {{maxLength}} characters', {
                      maxLength: 500,
                  })
                : false
        },
    })
    const alignFieldStart = useField(`${fieldName}.customText.align`, {
        type: 'radio',
        value: 'line-start',
    })
    const alignFieldCenter = useField(`${fieldName}.customText.align`, {
        type: 'radio',
        value: 'center',
    })
    const alignFieldEnd = useField(`${fieldName}.customText.align`, {
        type: 'radio',
        value: 'line-end',
    })

    const hasAnyDisplayOptions = [titleField, subtitleField].some(
        (field) => field.input.value
    )
    const [isChecked, setIsChecked] = useState(hasAnyDisplayOptions)

    const onCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <>
            <Checkbox
                label={i18n.t('Display title / subtitle')}
                onChange={onCheckboxChange}
                checked={isChecked}
            />
            {isChecked && (
                <>
                    <div className={classes.customTextFields}>
                        <InputFieldFF
                            input={titleField.input}
                            meta={titleField.meta}
                            inputWidth="400px"
                            label={i18n.t('Title')}
                        />
                        <InputFieldFF
                            input={subtitleField.input}
                            meta={subtitleField.meta}
                            inputWidth="400px"
                            label={i18n.t('Subtitle')}
                        />
                        <div className={classes.customTextAlignOptionsAndTitle}>
                            <p>{i18n.t('Position')}</p>
                            <div className={classes.customTextAlignOptions}>
                                <RadioFieldFF
                                    label={i18n.t('Line start')}
                                    input={alignFieldStart.input}
                                    meta={alignFieldStart.meta}
                                />
                                <RadioFieldFF
                                    label={i18n.t('Center')}
                                    input={alignFieldCenter.input}
                                    meta={alignFieldCenter.meta}
                                />
                                <RadioFieldFF
                                    label={i18n.t('Line end')}
                                    input={alignFieldEnd.input}
                                    meta={alignFieldEnd.meta}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
