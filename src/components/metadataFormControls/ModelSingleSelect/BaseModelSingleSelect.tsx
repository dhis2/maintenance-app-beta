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
    selected: TModel | undefined
    available: TModel[]
    onChange: ({ selected }: { selected: TModel | undefined }) => void
}

export type BaseModelSingleSelectProps<TModel extends DisplayableModel> = Omit<
    SearchableSingleSelectPropTypes,
    keyof OwnProps<TModel> | 'options' | 'selected'
> &
    OwnProps<TModel>

/* Simple wrapper component handle generic models with SingleSelect-component. */
export const BaseModelSingleSelect = <TModel extends DisplayableModel>({
    available,
    selected,
    onChange,
    ...searchableSingleSelectProps
}: BaseModelSingleSelectProps<TModel>) => {
    const { allModelsMap, allSingleSelectOptions } = useMemo(() => {
        const allModels = selected ? [selected].concat(available) : available
        const allModelsMap = new Map(allModels.map((o) => [o.id, o]))
        const allSingleSelectOptions = allModels.map(toDisplayOption)

        return {
            allModelsMap,
            allSingleSelectOptions,
        }
    }, [available, selected])

    const handleOnChange: SearchableSingleSelectPropTypes['onChange'] =
        useCallback(
            ({ selected }) => {
                // map the selected ids to the full model
                const fullSelectedModel = allModelsMap.get(selected)
                onChange({
                    selected: fullSelectedModel,
                })
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
