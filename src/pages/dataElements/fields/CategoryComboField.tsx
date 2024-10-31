import i18n from '@dhis2/d2-i18n'
import React, { useEffect, useRef } from 'react'
import { useForm, useFormState } from 'react-final-form'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect/ModelSingleSelectField'
import { useRefreshModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/useRefreshSingleSelect'
import {
    DEFAULT_CATEGORY_COMBO,
    useDefaultCategoryComboQuery,
} from '../../../lib'
import { PlainResourceQuery } from '../../../types'
import classes from './CategoryComboField.module.css'

const query = {
    resource: 'categoryCombos',
    params: {
        filter: 'isDefault:eq:false',
    },
} satisfies PlainResourceQuery

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
    const defaultCategoryComboQuery = useDefaultCategoryComboQuery()
    const { change } = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const domainTypeIsTracker = values.domainType === 'TRACKER'
    const disabled = domainTypeIsTracker
    const newCategoryComboLink = useHref('/categoryCombos/new')

    useEffect(() => {
        if (defaultCategoryComboQuery.data?.id && domainTypeIsTracker) {
            change('categoryCombo.id', defaultCategoryComboQuery.data.id)
        }
    }, [change, defaultCategoryComboQuery.data?.id, domainTypeIsTracker])

    return (
        <EditableFieldWrapper
            dataTest="formfields-categorycombo"
            onRefresh={() => refresh}
            onAddNew={() => window.open(newCategoryComboLink, '_blank')}
        >
            <div className={classes.categoryComboSelect}>
                <ModelSingleSelectField
                    query={query}
                    name="categoryCombo"
                    label={i18n.t('Category combo')}
                    required
                    select={(value) => [DEFAULT_CATEGORY_COMBO, ...value]}
                    disabled={disabled}
                />
            </div>
        </EditableFieldWrapper>
    )
}
