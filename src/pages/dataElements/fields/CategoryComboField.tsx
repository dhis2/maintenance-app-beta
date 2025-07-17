import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import { CategoryComboSelect, EditableFieldWrapper } from '../../../components'
import { useDefaultCategoryComboQuery } from '../../../lib'
import classes from './CategoryComboField.module.css'

const required = (value: { id: string }) => {
    if (!value.id) {
        return i18n.t('Required')
    }
}

/*
 * @TODO: Verify that the api ignores the category combo when it's disabled.
 *        If it does not, file a jira issue and "escalate" this so it will be
 *        implemented
 *
 * Field rule: Disable when domainType is TRACKER
 * Field rule: Set categoryCombo.id to the default category combo when
 *             domainType is Tracker
 */
export function CategoryComboField() {
    const defaultCategoryComboQuery = useDefaultCategoryComboQuery()
    const { change } = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const domainTypeIsTracker = values.domainType === 'TRACKER'
    const disabled = domainTypeIsTracker
    const validate = disabled ? undefined : required
    const newCategoryComboLink = useHref('/categoryCombos/new')
    const { input, meta } = useField('categoryCombo', {
        validateFields: [],
        validate,
        format: (categoryCombo) => categoryCombo.id,
        parse: (id) => ({ id }),
    })
    const categoryComboHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    useEffect(() => {
        if (defaultCategoryComboQuery.data?.id && domainTypeIsTracker) {
            change('categoryCombo.id', defaultCategoryComboQuery.data.id)
        }
    }, [change, defaultCategoryComboQuery.data?.id, domainTypeIsTracker])

    return (
        <EditableFieldWrapper
            onRefresh={() => categoryComboHandle.current.refetch()}
            onAddNew={() => window.open(newCategoryComboLink, '_blank')}
        >
            <div className={classes.categoryComboSelect}>
                <Field
                    required
                    name="categoryCombo.id"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Category combination'),
                    })}
                    helpText={i18n.t(
                        'Choose how this data element is disaggregated.'
                    )}
                    error={meta.touched && !!meta.error}
                    validationText={meta.touched ? meta.error : undefined}
                    dataTest="formfields-categorycombo"
                >
                    <CategoryComboSelect
                        required
                        placeholder=""
                        disabled={disabled}
                        invalid={meta.touched && !!meta.error}
                        ref={categoryComboHandle}
                        selected={input.value}
                        onChange={({ selected }) => {
                            input.onChange(selected)
                            input.onBlur()
                        }}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}
