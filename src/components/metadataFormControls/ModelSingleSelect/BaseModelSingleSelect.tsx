import i18n from '@dhis2/d2-i18n'
import React, { useCallback, useMemo } from 'react'
import { PartialLoadedDisplayableModel } from '../../../types/models'
import {
    SearchableSingleSelect,
    SearchableSingleSelectPropTypes,
} from '../../SearchableSingleSelect'

const toDisplayOption = (model: PartialLoadedDisplayableModel) => ({
    value: model.id,
    label: model.displayName || i18n.t('Loading...'),
})

type OwnProps<TModel> = {
    selected?: TModel
    available: TModel[]
    onChange: (selected: TModel | undefined) => void
    showNoValueOption?: { value: string; label: string } | boolean
}

export type BaseModelSingleSelectProps<
    TModel extends PartialLoadedDisplayableModel = PartialLoadedDisplayableModel
> = Omit<
    SearchableSingleSelectPropTypes,
    keyof OwnProps<TModel> | 'options' | 'selected'
> &
    OwnProps<TModel>

/* Simple wrapper component handle generic models with SingleSelect-component. */
export const BaseModelSingleSelect = <
    TModel extends PartialLoadedDisplayableModel
>({
    available,
    selected,
    onChange,
    showNoValueOption,
    ...searchableSingleSelectProps
}: BaseModelSingleSelectProps<TModel>) => {
    const { allModelsMap, allSingleSelectOptions } = useMemo(() => {
        const allModelsMap = new Map(available.map((o) => [o.id, o]))
        // due to pagination, the selected model might not be in the available list, so add it
        if (selected && selected.id && !allModelsMap.get(selected.id)) {
            allModelsMap.set(selected.id, selected)
        }
        const allSingleSelectOptions = Array.from(allModelsMap).map(
            ([, value]) => toDisplayOption(value)
        )
        if (showNoValueOption) {
            allSingleSelectOptions.unshift({
                value: '',
                label: i18n.t('<No value>'),
            })
        }

        return {
            allModelsMap,
            allSingleSelectOptions,
        }
    }, [available, selected, showNoValueOption])

    const handleOnChange: SearchableSingleSelectPropTypes['onChange'] =
        useCallback(
            ({ selected }) => {
                // map the selected id to the full model
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
