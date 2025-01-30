import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { TransferOption, Help } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, Field } from 'react-final-form'
import { TransferHeader } from '../../../components/index'
import { BaseModelTransfer } from '../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import css from './CompulsoryDataElementsTransfer.module.css'

const QUERY_CATEGORY_OPTION_COMBOS = {
    categoryCombos: {
        resource: 'categoryCombos',
        params: ({ categoryCombos }) => ({
            fields: 'id,displayName,categoryOptionCombos[id,displayName]',
            filter: `id:in:[${categoryCombos.join(',')}]`,
            paging: false,
        }),
    },
}

const getRelevantCategoryCombos = (value: any) => {
    return value
        .map(
            (dse) =>
                dse?.categoryCombo?.id ?? dse?.dataElement?.categoryCombo?.id
        )
        .sort()
}

const getOptions = ({ categoryCombos, dataSetElements }) => {
    if (
        !categoryCombos ||
        !dataSetElements ||
        !categoryCombos?.length ||
        !dataSetElements?.length
    ) {
        return []
    }
    const catComboMap = new Map(
        categoryCombos?.map((cc) => [cc.id, cc.categoryOptionCombos])
    )

    const options = dataSetElements.flatMap((dse) => {
        const categoryComboId = dse.dataElement.categoryCombo.id
        const categoryOptionCombos = catComboMap.get(categoryComboId)
        // return categoryOptionCombos
        return categoryOptionCombos?.map((coc) => ({
            id: `${dse?.dataElement?.id}.${coc?.id}`,
            displayName: `${dse.displayName}: ${coc.displayName}`,
            dataElement: {
                id: dse?.dataElement?.id,
                displayName: dse?.dataElement?.displayName,
            },
            categoryOptionCombo: {
                id: coc?.id,
                displayName: coc?.displayName,
            },
        }))
    })
    // if(options.includes(undefined)) {
    //     return []
    // }
    return options
}

export const CompulsoryDataElementsTransfer = () => {
    const { input: dseInput } = useField('dataSetElements')
    const { input } = useField('compulsoryDataElementOperands')

    const { data, loading, error, refetch } = useDataQuery(
        QUERY_CATEGORY_OPTION_COMBOS,
        { lazy: true }
    )

    const categoryCombos = getRelevantCategoryCombos(dseInput.value)

    useEffect(() => {
        refetch({ categoryCombos })
    }, [JSON.stringify(categoryCombos)])

    const calculatedOptions = getOptions({
        categoryCombos: data?.categoryCombos?.categoryCombos,
        dataSetElements: dseInput.value,
    })

    return (
        <>
            <Field name="compulsoryDataElementOperands">
                {() => (
                    <BaseModelTransfer
                        selected={input.value || []}
                        available={calculatedOptions || []}
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
                                                {
                                                    value.categoryOptionCombo
                                                        .displayName
                                                }
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
            <pre>{JSON.stringify(data?.categoryCombos, null, 4)}</pre>
            <pre>{JSON.stringify(dseInput.value, null, 4)}</pre>
            <h2>OPTIONS</h2>
            <pre>{JSON.stringify(calculatedOptions, null, 4)}</pre>
        </>
    )
}
