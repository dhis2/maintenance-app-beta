import i18n from '@dhis2/d2-i18n'
import { Field, Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { DOMAIN_TYPE } from '../../../lib'
import classes from './DomainField.module.css'

function createHandler<T>(callback: (e: T) => void) {
    return (_: object, e: T) => {
        callback(e)
    }
}

type FocusEvent = React.FocusEvent<HTMLInputElement>
type ChangeEvent = React.ChangeEvent<HTMLInputElement>

export function DomainField() {
    const name = 'domainType'
    const validate = (value: string) => (!value ? 'Required' : undefined)
    const aggregateInput = useField(name, {
        type: 'radio',
        value: 'AGGREGATE',
        validate,
        validateFields: [],
    })
    const trackerInput = useField(name, {
        type: 'radio',
        value: 'TRACKER',
        validate,
        validateFields: [],
    })
    const touched = aggregateInput.meta.touched || trackerInput.meta.touched
    const error = aggregateInput.meta.error || trackerInput.meta.error

    return (
        <Field
            required
            dataTest="formfields-domaintype"
            name={name}
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Domain'),
            })}
            helpText={i18n.t(
                'A data element can either be aggregated or tracked data.'
            )}
            error={touched && !!error}
            validationText={touched ? error : undefined}
        >
            <div>
                <Radio
                    {...aggregateInput.input}
                    className={classes.domainTypeRadioButton}
                    label={DOMAIN_TYPE.AGGREGATE}
                    onChange={createHandler<ChangeEvent>(
                        aggregateInput.input.onChange
                    )}
                    onBlur={createHandler<FocusEvent>(
                        aggregateInput.input.onBlur
                    )}
                    onFocus={createHandler<FocusEvent>(
                        aggregateInput.input.onFocus
                    )}
                />

                <Radio
                    {...trackerInput.input}
                    label={DOMAIN_TYPE.TRACKER}
                    className={classes.domainTypeRadioButton}
                    onChange={createHandler<ChangeEvent>(
                        trackerInput.input.onChange
                    )}
                    onBlur={createHandler<FocusEvent>(
                        trackerInput.input.onBlur
                    )}
                    onFocus={createHandler<FocusEvent>(
                        trackerInput.input.onFocus
                    )}
                />
            </div>
        </Field>
    )
}
