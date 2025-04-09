import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import css from './CategoriesSelector.module.css'

export const CategoriesSelector = () => {
    return (
        <>
        <div className={css.selectorContainer}>
            <div>{i18n.t('Add a category')}</div>
            <ModelSingleSelect
                query={{
                    resource: 'categories',
                }}
                onChange={() => {}}
            />
        </div>
        <div className={css.selectorContainer}>
            <div>{i18n.t('Add categories from a category combination')}</div>
            <ModelSingleSelect
                query={{
                    resource: 'categoryCombos',
                }}
                onChange={() => {}}
            />
        </div>        
        </>
    )
}