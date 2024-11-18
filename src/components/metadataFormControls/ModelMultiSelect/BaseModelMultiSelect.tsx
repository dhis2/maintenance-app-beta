import React, { useCallback, useMemo } from 'react'
import { DisplayableModel } from '../../../types/models'
import {
    SearchableMultiSelect,
    SearchableMultiSelectPropTypes,
} from '../../SearchableMultiSelect'

const toDisplayOption = (model: DisplayableModel) => ({
    value: model.id,
    label: model.displayName,
})

type OwnProps<TModel> = {
    selected: TModel[]
    available: TModel[]
    onChange: ({ selected }: { selected: TModel[] }) => void
    noValueOption?: { value: string; label: string }
}

export type BaseModelMultiSelectProps<TModel extends DisplayableModel> = Omit<
    SearchableMultiSelectPropTypes,
    keyof OwnProps<TModel> | 'options' | 'selected'
> &
    OwnProps<TModel>

/* Simple wrapper component handle generic models with MultiSelect-component. */
export const BaseModelMultiSelect = <TModel extends DisplayableModel>({
    available,
    selected,
    onChange,
    noValueOption,
    ...searchableMultiSelectProps
}: BaseModelMultiSelectProps<TModel>) => {
    const { allModelsMap, allSingleSelectOptions, selectedOptions } =
        useMemo(() => {
            const allModelsMap = new Map(available.map((o) => [o.id, o]))
            // due to pagination, the selected models might not be in the available list, so add them
            selected.forEach((s) => {
                if (!allModelsMap.get(s.id)) {
                    allModelsMap.set(s.id, s)
                }
            })

            const allSingleSelectOptions = Array.from(allModelsMap).map(
                ([, value]) => toDisplayOption(value)
            )

            const selectedOptions = selected.map((s) => s.id)
            if (noValueOption) {
                allSingleSelectOptions.unshift(noValueOption)
            }

            return {
                allModelsMap,
                allSingleSelectOptions,
                selectedOptions,
            }
        }, [available, selected, noValueOption])

    const handleOnChange = useCallback(
        ({ selected }: { selected: string[] }) => {
            if (!selected) {
                return
            }

            const selectedModels = selected
                .map((s) => allModelsMap.get(s))
                .filter((s) => !!s)

            onChange({ selected: selectedModels })
        },
        [onChange, allModelsMap]
    )

    return (
        <SearchableMultiSelect
            {...searchableMultiSelectProps}
            selected={selectedOptions}
            options={allSingleSelectOptions}
            onChange={handleOnChange}
        />
    )
}
