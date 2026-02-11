import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    CheckboxFieldFF,
    InputFieldFF,
    Radio,
    RadioFieldFF,
} from '@dhis2/ui'
import DOMPurify from 'dompurify'
import React, { useState } from 'react'
import { Field, useField } from 'react-final-form'
import classes from './DisplayOptionField.module.css'

export function DisplayOptionsField({
    withSectionsDisplayOptions,
}: Readonly<{
    withSectionsDisplayOptions: boolean
}>) {
    const fieldName = 'displayOptions'
    const titleField = useField(`${fieldName}.customText.header`, {
        validate: (value) => {
            return value?.length > 500
                ? i18n.t('Should not exceed {{maxLength}} characters', {
                      maxLength: 500,
                  })
                : false
        },
        format: (value) =>
            typeof value === 'string' ? DOMPurify.sanitize(value) : value,
    })
    const subtitleField = useField(`${fieldName}.customText.subheader`, {
        validate: (value) => {
            return value?.length > 500
                ? i18n.t('Should not exceed {{maxLength}} characters', {
                      maxLength: 500,
                  })
                : false
        },
        format: (value) =>
            typeof value === 'string' ? DOMPurify.sanitize(value) : value,
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
    const renderAsTabs = useField(`renderAsTabs`)

    const renderAsHorizonalTabs = useField(`${fieldName}.tabsDirection`, {
        type: 'radio',
        value: 'horizontal',
        defaultValue: 'horizontal',
    })
    const renderAsVerticalTabs = useField(`${fieldName}.tabsDirection`, {
        type: 'radio',
        value: 'vertical',
    })

    const hasAnyDisplayOptions = [titleField, subtitleField].some(
        (field) => field.input.value
    )
    const [isTitlesChecked, setIsTitlesChecked] = useState(hasAnyDisplayOptions)

    const onTitlesCheckboxChange = () => {
        setIsTitlesChecked(!isTitlesChecked)
        titleField.input.onChange(undefined)
        subtitleField.input.onChange(undefined)
    }

    return (
        <>
            <Checkbox
                label={i18n.t('Display title / subtitle')}
                onChange={onTitlesCheckboxChange}
                checked={isTitlesChecked}
            />
            {isTitlesChecked && (
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
            {withSectionsDisplayOptions && (
                <div className={classes.displayMode}>
                    <p>{i18n.t('Section display mode')}</p>
                    <Radio
                        checked={!renderAsTabs.input.value}
                        onChange={({ checked }) => {
                            renderAsTabs.input.onChange(!checked)
                        }}
                        onBlur={renderAsTabs.onBlur}
                        label={i18n.t(
                            'Single page: all sections shown consecutively in one form',
                            { nsSeparator: '~:~' }
                        )}
                    />
                    <Radio
                        checked={!!renderAsTabs.input.value}
                        onChange={({ checked }) => {
                            renderAsTabs.input.onChange(checked)
                        }}
                        onBlur={renderAsTabs.onBlur}
                        label={i18n.t('Tabs: show a tab for each section', {
                            nsSeparator: '~:~',
                        })}
                    />
                    {!!renderAsTabs.input.value && (
                        <div className={classes.renderAsTabsOptions}>
                            <RadioFieldFF
                                input={renderAsHorizonalTabs.input}
                                meta={renderAsHorizonalTabs.meta}
                                label={i18n.t('Horizontal tabs')}
                            />
                            <RadioFieldFF
                                input={renderAsVerticalTabs.input}
                                meta={renderAsVerticalTabs.meta}
                                label={i18n.t('Vertical tabs')}
                            />
                        </div>
                    )}
                    {withSectionsDisplayOptions && (
                        <div className={classes.renderHorizontally}>
                            <Field
                                name="renderHorizontally"
                                type="checkbox"
                                component={CheckboxFieldFF}
                                label={i18n.t(
                                    'Render multi-organisation unit forms vertically'
                                )}
                            />
                            <p>
                                {i18n.t(
                                    'Only applied to section forms using multiple organisation units'
                                )}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
