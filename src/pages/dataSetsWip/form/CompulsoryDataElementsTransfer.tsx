import i18n from '@dhis2/d2-i18n'
import { TransferOption, Help } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, Field } from 'react-final-form'
import { TransferHeader } from '../../../components/index'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import css from './CompulsoryDataElementsTransfer.module.css'
import { useGetCompulsoryDataElementOperandsOptions } from './useGetCompulsoryDataElementOperandsOptions'

export const CompulsoryDataElementsTransfer = () => {
    const { input } = useField('compulsoryDataElementOperands')

    const { options } = useGetCompulsoryDataElementOperandsOptions() ?? {
        options: null,
    }

    // selected values must be pruned when options change
    // if a DE has been removed for data set, it cannot be selected as compulsory
    useEffect(() => {
        if (options === null) {
            return
        }
        const optionIds = options.map(({ id }: { id: string }) => id)
        const filteredSelected = (input.value || []).filter(
            ({ id }: { id: string }) => optionIds.includes(id)
        )
        input.onChange(filteredSelected)
    }, [options])

    return (
        <>
            <Field name="compulsoryDataElementOperands">
                {() => (
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
                        filterPlaceholder={i18n.t(
                            'Search available data elements'
                        )}
                        filterPlaceholderPicked={i18n.t(
                            'Search compulsory data elements'
                        )}
                        filterable={true}
                        filterablePicked={true}
                        height="350px"
                        optionsWidth="500px"
                        selectedWidth="500px"
                        renderOption={({ value, ...rest }) => {
                            const catOptComboName =
                                value.categoryOptionCombo.displayName ===
                                'default'
                                    ? i18n.t('None')
                                    : value.categoryOptionCombo.displayName
                            return (
                                <TransferOption
                                    {...rest}
                                    label={
                                        <div>
                                            <div>
                                                {value.dataElement.displayName}
                                            </div>
                                            <Help
                                                className={
                                                    css.transferOptionCatComboText
                                                }
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
                )}
            </Field>
        </>
    )
}
