import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Field,
    Help,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useField, useForm } from 'react-final-form'
import { ModelTransfer } from '../../../components'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'
import css from './DataSetElementModelTransfer.module.css'

type DataElementWithCategoryCombo = {
    id: string
    displayName: string
    categoryCombo: { id: string; displayName: string }
}

type DataSetElement = {
    categoryCombo?: { id: string; name: string; displayName: string }
    dataElement: DataElementWithCategoryCombo
}

export function DataSetElementsModelTransferField() {
    const name = 'dataSetElements'
    const [modalOpen, setModalOpen] = useState(false)

    const { input, meta } = useField<
        DataSetElement[],
        HTMLElement,
        (DisplayableModel & DataSetElement)[]
    >(name, {
        multiple: true,
        validateFields: [],
    })

    const withComboName =
        input.value
            .map((dse) => ({
                ...dse,
                id: dse.dataElement.id,
                displayName: dse.categoryCombo
                    ? `${dse.dataElement.displayName} (${dse.categoryCombo?.displayName})`
                    : dse.dataElement.displayName,
            }))
            .sort((a, b) => a.displayName.localeCompare(b.displayName)) || []

    return (
        <Field
            dataTest="formfields-modeltransfer"
            error={meta.invalid}
            validationText={(meta.touched && meta.error?.toString()) || ''}
            name={name}
            className={css.moduleTransferField}
        >
            <ModelTransfer<
                DataSetElement & DisplayableModel,
                DataElementWithCategoryCombo
            >
                selected={withComboName}
                onChange={({ selected }) => {
                    input.onChange(selected)
                    input.onBlur()
                }}
                transform={(dataElements) => {
                    return dataElements.map((de) => ({
                        dataElement: {
                            ...de,
                        },
                        id: de.id,
                        displayName: de.displayName,
                        categoryCombo: undefined,
                    }))
                }}
                leftHeader={i18n.t('Available data elements')}
                rightHeader={i18n.t('Selected data elements')}
                filterPlaceholder={i18n.t('Search available data elements')}
                filterPlaceholderPicked={i18n.t(
                    'Search selected data elements'
                )}
                query={{
                    resource: 'dataElements',
                    params: {
                        filter: 'domainType:eq:AGGREGATE',
                        fields: [
                            'id',
                            'displayName',
                            'categoryCombo[id,displayName]',
                        ],
                    },
                }}
                enableOrderChange={false}
                rightFooter={
                    <div className={css.modelTransferFooter}>
                        <Button
                            small
                            secondary
                            disabled={input.value.length === 0}
                            onClick={() => setModalOpen(true)}
                        >
                            {i18n.t('Custom disaggregation')}
                        </Button>
                    </div>
                }
            />
            {modalOpen && (
                <CustomDisaggregationModal
                    onClose={() => setModalOpen(false)}
                    selected={withComboName}
                />
            )}
        </Field>
    )
}

type CustomDisaggregationModalProps = {
    onClose: () => void
    selected: DataSetElement[]
}
const CustomDisaggregationModal = ({
    onClose,
    selected,
}: CustomDisaggregationModalProps) => {
    const form = useForm()

    const handleChange = (dse: DataSetElement) => {
        const withNewDse = selected.map((s) =>
            s.dataElement.id === dse.dataElement.id ? dse : s
        )
        form.change('dataSetElements', withNewDse)
    }

    return (
        <Modal onClose={onClose} large>
            <ModalTitle>
                {i18n.t('Override data element category combination')}
            </ModalTitle>
            <ModalContent>
                <div className={css.modalContentWrapper}>
                    {selected.length === 0 && (
                        <div>{i18n.t('No data elements selected')}</div>
                    )}
                    {selected.map((dse) => (
                        <div
                            key={dse.dataElement.id}
                            className={css.fieldWrapper}
                        >
                            <div className={css.dataElementWrapper}>
                                <div>{dse.dataElement.displayName}</div>
                                {dse.dataElement.categoryCombo.displayName &&
                                    dse.dataElement.categoryCombo
                                        .displayName !== 'default' && (
                                        <Help>
                                            {
                                                dse.dataElement.categoryCombo
                                                    .displayName
                                            }
                                        </Help>
                                    )}
                            </div>
                            <div className={css.categoryComboSelect}>
                                <ModelSingleSelect
                                    query={{
                                        resource: 'categoryCombos',
                                        params: {
                                            filter: 'dataDimensionType:eq:DISAGGREGATION',
                                        },
                                    }}
                                    selected={dse.categoryCombo}
                                    onChange={(catCombo) => {
                                        handleChange({
                                            ...dse,
                                            categoryCombo: catCombo,
                                        })
                                    }}
                                    placeholder={i18n.t(
                                        'Override data element category combination'
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ModalContent>
            <ModalActions>
                <Button primary onClick={onClose}>
                    {i18n.t('Close')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
