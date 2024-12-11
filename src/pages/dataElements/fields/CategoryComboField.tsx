import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, useForm } from 'react-final-form'
import { useHref } from 'react-router'
import { CategoryComboSelect, EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFieldProps
} from '../../../components/metadataFormControls/ModelSingleSelect/ModelSingleSelectField'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { PlainResourceQuery } from '../../../types'
import classes from './CategoryComboField.module.css'
import { DisplayableModel } from '../../../types/models'

const query = {
    resource: 'categoryCombos',
    params: {
        filter: ['isDefault:eq:false'],
        fields: ['id', 'displayName'],
    },
} as const satisfies PlainResourceQuery

// stable reference for transform function
const withDefaultCategoryCombo: ModelSingleSelectFieldProps['transform'] = (
    value
) => [DEFAULT_CATEGORY_COMBO, ...value]
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
    const refresh = useRefreshModelSingleSelect(query)
    const { change } = useForm()
    const {
        input: { value: domainTypeValue },
    } = useField('domainType')
    const { input, meta } = useField<DisplayableModel>('categoryCombo', { validateFields: [] })
    const domainTypeIsTracker = domainTypeValue === 'TRACKER'
    const disabled = domainTypeIsTracker
    const newCategoryComboLink = useHref('/categoryCombos/new')

    useEffect(() => {
        if (domainTypeIsTracker) {
            change('categoryCombo', DEFAULT_CATEGORY_COMBO)
        }
    }, [change, domainTypeIsTracker])

    return (
        <EditableFieldWrapper
            dataTest="formfields-categorycombo"
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newCategoryComboLink, '_blank')}
        >
            <div className={classes.categoryComboSelect}>
                <Field
                    required
                    name="categoryCombo"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Category combination'),
                    })}
                    helpText={i18n.t(
                        'Choose how this data element is disaggregated'
                    )}
                    error={meta.touched && !!meta.error}
                    validationText={meta.touched ? meta.error : undefined}
                    dataTest="formfields-categorycombo"
                >
                    <CategoryComboSelect
                        selected={input.value}
                        disabled={disabled}
                        onChange={(selected) => {
                            input.onChange(selected)
                            input.onBlur()
                        }}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        query={{
                            resource: 'categoryCombos',
                            params: {
                                filter: [
                                    'isDefault:eq:false',
                                    'dataDimensionType:eq:DISAGGREGATION',
                                ],
                            },
                        }}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}
