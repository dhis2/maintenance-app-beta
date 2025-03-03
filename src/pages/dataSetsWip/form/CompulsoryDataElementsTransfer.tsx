import i18n from '@dhis2/d2-i18n'
import { TransferOption, Help } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField } from 'react-final-form'
import { TransferHeader } from '../../../components/index'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import css from './CompulsoryDataElementsTransfer.module.css'
import { useCompulsoryDataElementOperandsQuery } from './useGetCompulsoryDataElementOperandsOptions'

export const CompulsoryDataElementsTransfer = () => {
    const { input } = useField('compulsoryDataElementOperands')
    const { input: dseInput } = useField('dataSetElements')

    const { data: options } = useCompulsoryDataElementOperandsQuery({
        dataSetElements: dseInput.value,
    }) ?? {
        data: {},
    }

    // selected values must be pruned when options change
    // if a DE has been removed for data set, it cannot be selected as compulsory

    /* eslint-disable react-hooks/exhaustive-deps */
    // input is excluded from deps because it not a stable reference and would cause an infite loop
    useEffect(() => {
        if (options === null || options === undefined) {
            return
        }
        const optionIds = options.map(({ id }: { id: string }) => id)
        const filteredSelected = (input.value || []).filter(
            ({ id }: { id: string }) => optionIds.includes(id)
        )
        input.onChange(filteredSelected)
    }, [options])
    /* eslint-enable react-hooks/exhaustive-deps */

    return (
        <BaseModelTransfer
            selected={input.value || []}
            available={options || []}
            onChange={({ selected }) => {
                input.onChange(selected)
            }}
            leftHeader={
                <TransferHeader>
                    {i18n.t('Available data elements')}
                </TransferHeader>
            }
            rightHeader={
                <TransferHeader>
                    {i18n.t('Compulsory data elements')}
                </TransferHeader>
            }
            filterPlaceholder={i18n.t('Search available data elements')}
            filterPlaceholderPicked={i18n.t('Search compulsory data elements')}
            filterable={true}
            filterablePicked={true}
            height="350px"
            optionsWidth="500px"
            selectedWidth="500px"
            renderOption={({ value, ...rest }) => {
                const catOptComboName =
                    value.categoryOptionCombo.displayName === 'default'
                        ? i18n.t('None')
                        : value.categoryOptionCombo.displayName
                return (
                    <TransferOption
                        {...rest}
                        label={
                            <div>
                                <div>{value.dataElement.displayName}</div>
                                <Help
                                    className={css.transferOptionCatComboText}
                                >
                                    {catOptComboName}
                                </Help>
                            </div>
                        }
                        value={value.id}
                    />
                )
            }}
        />
    )
}
