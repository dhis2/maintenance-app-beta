import React, { useCallback } from 'react'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { PlainResourceQuery } from '../../../types'
import { CategoryCombo } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import {
    ModelSingleSelect,
    ModelSingleSelectProps,
} from '../ModelSingleSelect/ModelSingleSelect'

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
    // add defaultCatcombo (None) to the list of categoryCombos
    const transform = useCallback(
        (value: TCategoryCombo[]) => [
            DEFAULT_CATEGORY_COMBO as TCategoryCombo,
            ...value,
        ],
        []
    )

    return (
        <ModelSingleSelect<TCategoryCombo>
            query={resolvedQuery}
            transform={transform}
            {...modelSingleSelectProps}
        />
    )
}
