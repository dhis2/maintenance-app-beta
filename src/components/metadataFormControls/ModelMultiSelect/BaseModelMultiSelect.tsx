import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useMemo } from 'react'
import { PartialLoadedDisplayableModel } from '../../../types/models'
import {
    SearchableMultiSelect,
    SearchableMultiSelectPropTypes,
} from '../../SearchableMultiSelect'

const toDisplayOption = (model: PartialLoadedDisplayableModel) => ({
    value: model.id,
    label: model.displayName || 'Loading...',
})

type OwnProps<TModel> = {
    selected: TModel[]
    available: TModel[]
    onChange: ({ selected }: { selected: TModel[] }) => void
    showNoValueOption?: boolean
}

export type BaseModelMultiSelectProps<
    TModel extends PartialLoadedDisplayableModel
> = Omit<
    SearchableMultiSelectPropTypes,
    keyof OwnProps<TModel> | 'options' | 'selected'
> &
    OwnProps<TModel>

/* Simple wrapper component handle generic models with MultiSelect-component. */
export const BaseModelMultiSelect = <
    TModel extends PartialLoadedDisplayableModel
>({
    available,
    selected,
    onChange,
    showNoValueOption: noValueOption,
    ...searchableMultiSelectProps
}: BaseModelMultiSelectProps<TModel>) => {
    const { allModelsMap, allOptions, selectedOptions } = useMemo(() => {
        const allModelsMap = new Map(available.map((o) => [o.id, o]))
        // due to pagination, the selected models might not be in the available list, so add them
        selected.forEach((s) => {
            if (!allModelsMap.get(s.id)) {
                allModelsMap.set(s.id, s)
            }
        })

        const allOptions = Array.from(allModelsMap).map(([, value]) =>
            toDisplayOption(value)
        )

        const selectedOptions = selected.map((s) => s.id)
        if (noValueOption) {
            allOptions.unshift({
                value: '',
                label: i18n.t('<No value>'),
            })
        }

        return {
            allModelsMap,
            allOptions,
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
            options={allOptions}
            onChange={handleOnChange}
        />
    )
}
