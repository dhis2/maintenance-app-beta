import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useRef } from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { EditableFieldWrapper, OptionSetSelect } from '../../../components'
import classes from './OptionSetCommentField.module.css'

/**
 *
 * OptionSetComment
 *
 */
export function OptionSetCommentField() {
    const newOptionSetLink = useHref('/optionSets/new')
    // Not using a dot path because setting the value to an empty string
    // removes the option set from the form state entirely
    const { input, meta } = useField('commentOptionSet', {
        validateFields: [],
        format: (optionSet) => optionSet.id,
        parse: (id) => ({ id }),
    })
    const optionSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            onRefresh={() => optionSetHandle.current.refetch()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <div className={classes.optionSetCommentSelect}>
                <Field
                    name="commentOptionSet.id"
                    label={i18n.t('Option set comment')}
                    helpText={i18n.t(
                        'Choose a set of predefined comments for data entry.'
                    )}
                    validationText={meta.touched ? meta.error : undefined}
                    error={meta.touched && !!meta.error}
                    dataTest="formfields-commentoptionset"
                >
                    <OptionSetSelect
                        ref={optionSetHandle}
                        invalid={meta.touched && !!meta.error}
                        placeholder=""
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}
