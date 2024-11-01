import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { PlainResourceQuery } from '../../../types'
import { CategoryCombo } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import {
    ModelSingleSelect,
    ModelSingleSelectProps,
} from '../ModelSingleSelect/ModelSingleSelectRefactor'

export const categoryCombosSelectQuery = {
    resource: 'categoryCombos',
    params: {
        filter: 'isDefault:eq:false',
        fields: ['id', 'displayName'],
    },
} as const satisfies PlainResourceQuery

type CategoryComboSelectProps<TCategoryCombo extends DisplayableModel> = Omit<
    ModelSingleSelectProps<TCategoryCombo>,
    'query'
> & {
    query?: PlainResourceQuery
}

export const CategoryComboSelect = <
    TCategoryCombo extends Partial<CategoryCombo> & DisplayableModel = Pick<
        CategoryCombo,
        'id' | 'displayName'
    >
>({
    query,
    ...modelSingleSelectProps
}: CategoryComboSelectProps<TCategoryCombo>) => {
    const resolvedQuery = query ?? categoryCombosSelectQuery
    return (
        <ModelSingleSelect {...modelSingleSelectProps} query={resolvedQuery} />
    )
}
