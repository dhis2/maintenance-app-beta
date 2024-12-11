import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useMemo } from 'react'
import { DisplayableModel } from '../../../types/models'
import {
    SearchableSingleSelect,
    SearchableSingleSelectPropTypes,
} from '../../SearchableSingleSelect'


const toDisplayOption = (model: DisplayableModel) => ({
    value: model.id,
    label: model.displayName || i18n.t('Loading...'),
})

type OwnProps<TModel> = {
    selected?: TModel
    available: TModel[]
    onChange: (selected: TModel | undefined) => void
    noValueOption?: { value: string; label: string } | boolean
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
    noValueOption,
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
        if (noValueOption) {
            const option = noValueOption === true ? { value: '', label: i18n.t('<No value>') } : noValueOption
            allSingleSelectOptions.unshift(option)
        }

        return {
            allModelsMap,
            allSingleSelectOptions,
        }
    }, [available, selected, noValueOption])

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
