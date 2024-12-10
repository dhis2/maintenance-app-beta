import React, { useCallback, useMemo } from 'react'
import { DisplayableModel } from '../../../types/models'
import {
    SearchableSingleSelect,
    SearchableSingleSelectPropTypes,
} from '../../SearchableSingleSelect'

const toDisplayOption = (model: DisplayableModel) => ({
    value: model.id,
    label: model.displayName,
})

type OwnProps<TModel> = {
    selected?: TModel
    available: TModel[]
    onChange: (selected: TModel | undefined) => void
    showNoValueOption?: boolean
}

export type BaseModelSingleSelectProps<TModel extends DisplayableModel = DisplayableModel> = Omit<
    SearchableSingleSelectPropTypes,
    keyof OwnProps<TModel> | 'options' | 'selected'
> &
    OwnProps<TModel>

/* Simple wrapper component handle generic models with SingleSelect-component. */
export const BaseModelSingleSelect = <TModel extends DisplayableModel>({
    available,
    selected,
    onChange,
    showNoValueOption,
    ...searchableSingleSelectProps
}: BaseModelSingleSelectProps<TModel>) => {
    const { allModelsMap, allSingleSelectOptions } = useMemo(() => {
        const allModelsMap = new Map(available.map((o) => [o.id, o]))
        // due to pagination, the selected model might not be in the available list, so add it
        if (selected && !allModelsMap.get(selected.id)) {
            allModelsMap.set(selected.id, selected)
        }
        const allSingleSelectOptions = Array.from(allModelsMap).map(
            ([, value]) => toDisplayOption(value)
        )
        if (showNoValueOption) {
            allSingleSelectOptions.unshift({ value: '', label: '' })
        }

        return {
            allModelsMap,
            allSingleSelectOptions,
        }
    }, [available, selected, showNoValueOption])

    const handleOnChange: SearchableSingleSelectPropTypes['onChange'] =
        useCallback(
            ({ selected }) => {
                // map the selected ids to the full model
                const fullSelectedModel = allModelsMap.get(selected)
                onChange(fullSelectedModel)
            },
            [onChange, allModelsMap]
        )

    return (
        <SearchableSingleSelect
            {...searchableSingleSelectProps}
            selected={selected?.id}
            options={allSingleSelectOptions}
            onChange={handleOnChange}
        />
    )
}
