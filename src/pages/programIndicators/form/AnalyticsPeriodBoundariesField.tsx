import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Field,
    InputField,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useField } from 'react-final-form'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'
import { AnalyticsPeriodBoundary } from '../../../types/generated'
import styles from '../../dataSetsWip/form/dataInputPeriods/DataInputPeriodsSelector.module.css'
import classes from './AnalyticsPeriodBoundaries.module.css'
import offsetPeriodType = AnalyticsPeriodBoundary.offsetPeriodType

const boundaryTargets = [
    {
        label: i18n.t('Incident date'),
        value: 'INCIDENT_DATE',
    },
    {
        label: i18n.t('Event date'),
        value: 'EVENT_DATE',
    },
    {
        label: i18n.t('Enrollment date'),
        value: 'ENROLLMENT_DATE',
    },
    {
        label: i18n.t('Custom'),
        value: 'CUSTOM',
    },
]

const boundaryTypes = [
    {
        label: i18n.t('Before start of reporting period'),
        value: AnalyticsPeriodBoundary.analyticsPeriodBoundaryType
            .BEFORE_START_OF_REPORTING_PERIOD,
    },
    {
        label: i18n.t('Before end of reporting period'),
        value: AnalyticsPeriodBoundary.analyticsPeriodBoundaryType
            .BEFORE_END_OF_REPORTING_PERIOD,
    },
    {
        label: i18n.t('After start of reporting period'),
        value: AnalyticsPeriodBoundary.analyticsPeriodBoundaryType
            .AFTER_START_OF_REPORTING_PERIOD,
    },
    {
        label: i18n.t('After end of reporting period'),
        value: AnalyticsPeriodBoundary.analyticsPeriodBoundaryType
            .AFTER_END_OF_REPORTING_PERIOD,
    },
]

const APBItem = ({
    apb,
    onRemove,
    onEdit,
}: {
    apb: Partial<AnalyticsPeriodBoundary>
    onRemove: () => void
    onEdit: (apb: Partial<AnalyticsPeriodBoundary>) => void
}) => {
    const foundBoundaryTarget = useMemo(
        () =>
            boundaryTargets.find(
                (target) => apb.boundaryTarget === target.value
            ),
        [apb]
    )
    const foundBoundaryType = useMemo(
        () =>
            boundaryTypes.find(
                (type) => apb.analyticsPeriodBoundaryType === type.value
            ),
        [apb]
    )
    return (
        <div
            className={classes.analyticsPeriodBoundaryContainer}
            data-test="analytics-period-boundary"
        >
            <div>
                <div>
                    {foundBoundaryTarget?.label ??
                        `${i18n.t('Custom')}: ${apb.boundaryTarget}`}
                </div>
                <div className={classes.analyticsPeriodBoundarySpan}>
                    {apb.offsetPeriodType && (
                        <div>
                            {i18n.t('Period')}: {apb.offsetPeriodType}
                        </div>
                    )}
                    {apb.offsetPeriods !== undefined && (
                        <div>
                            {i18n.t('Offset')}: {apb.offsetPeriods}
                        </div>
                    )}
                    {foundBoundaryType && (
                        <div>
                            {i18n.t('Type')}: {foundBoundaryType.label}
                        </div>
                    )}
                </div>
            </div>
            <ButtonStrip>
                <Button
                    small
                    dataTest="apb-edit-button"
                    onClick={() => {
                        onEdit(apb)
                    }}
                >
                    {i18n.t('Edit')}
                </Button>
                <Button
                    small
                    dataTest="apb-remove-button"
                    secondary
                    destructive
                    onClick={() => {
                        onRemove()
                    }}
                >
                    {i18n.t('Remove')}
                </Button>
            </ButtonStrip>
        </div>
    )
}
const APBItemForm = ({
    APB,
    onFieldChange,
}: {
    APB: Partial<AnalyticsPeriodBoundary>
    onFieldChange: (apb: Partial<AnalyticsPeriodBoundary>) => void
}) => {
    const [customBoundaryTarget, setCustomBoundaryTarget] = useState(false)
    useEffect(() => {
        const filteredBoundaryTargets = boundaryTargets.filter(
            (e) => e.value !== 'CUSTOM' && e.value === APB.boundaryTarget
        ).length
        if (APB.boundaryTarget && filteredBoundaryTargets === 0) {
            setCustomBoundaryTarget(true)
        }
    }, [APB])

    return (
        <div className={classes.analyticsPeriodBoundaryForm}>
            <SingleSelectField
                dataTest="apb-target-select"
                selected={
                    customBoundaryTarget
                        ? 'CUSTOM'
                        : boundaryTargets.find(
                              (e) => e.value === APB.boundaryTarget
                          )?.value
                }
                onChange={({ selected }) => {
                    if (selected === 'CUSTOM') {
                        setCustomBoundaryTarget(true)
                        onFieldChange({
                            boundaryTarget: '',
                        } as unknown as Partial<AnalyticsPeriodBoundary>)
                    } else {
                        setCustomBoundaryTarget(false)
                        onFieldChange({ boundaryTarget: selected })
                    }
                }}
                label={i18n.t('Boundary target')}
            >
                {boundaryTargets.map((option) => (
                    <SingleSelectOption key={option.value} {...option} />
                ))}
            </SingleSelectField>
            {customBoundaryTarget && (
                <InputField
                    dataTest="apb-custom-target-text"
                    label={i18n.t('Custom boundary text')}
                    onChange={(e) => onFieldChange({ boundaryTarget: e.value })}
                    value={APB.boundaryTarget}
                />
            )}
            <SingleSelectField
                selected={APB.analyticsPeriodBoundaryType}
                dataTest="apb-type-select"
                onChange={({ selected }) => {
                    onFieldChange({
                        analyticsPeriodBoundaryType:
                            selected as AnalyticsPeriodBoundary.analyticsPeriodBoundaryType,
                    })
                }}
                label={i18n.t('Analytics period boundary type')}
            >
                <SingleSelectOption label={'<No value>'} value={''} />
                {boundaryTypes.map((option) => (
                    <SingleSelectOption key={option.value} {...option} />
                ))}
            </SingleSelectField>
            <InputField
                type="number"
                dataTest="apb-offset-input"
                label={i18n.t('Offset period by amount')}
                onChange={(e) =>
                    onFieldChange({
                        offsetPeriods: e.value ? parseInt(e.value) : undefined,
                    })
                }
                value={APB.offsetPeriods?.toString()}
                dense
                min={'0'}
            />
            <Field label={i18n.t('Period type')}>
                <PeriodTypeSelect
                    selected={APB.offsetPeriodType}
                    onChange={(selected) => {
                        onFieldChange({
                            offsetPeriodType: selected as offsetPeriodType,
                        })
                    }}
                    noValueOption
                    dataTest="apb-period-type-select"
                />
            </Field>
        </div>
    )
}

const AnalyticsPeriodBoundaryModal = ({
    closeModal,
    onSaveAPB,
    APB,
}: {
    closeModal: () => void
    onSaveAPB: (apb: Partial<AnalyticsPeriodBoundary>) => void
    APB: Partial<AnalyticsPeriodBoundary>
}) => {
    const [editedAPB, setEditedAPB] = useState(APB)
    const onFieldChange = (changes: Partial<AnalyticsPeriodBoundary>) => {
        setEditedAPB((previous) => ({ ...previous, ...changes }))
    }

    return (
        <Modal onClose={closeModal} dataTest="analytics-period-boundary-modal">
            <ModalTitle>
                {editedAPB
                    ? i18n.t('Edit analytics period boundary')
                    : i18n.t('Add analytics period boundary')}
            </ModalTitle>
            <ModalContent className={styles.modalItems}>
                <APBItemForm APB={editedAPB} onFieldChange={onFieldChange} />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={closeModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        dataTest="save-apb-button"
                        primary
                        onClick={() => {
                            onSaveAPB(editedAPB)
                        }}
                    >
                        {i18n.t('Save analytics period boundary')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

export const AnalyticsPeriodBoundariesField = () => {
    const [modalAPB, setModalAPB] =
        useState<Partial<AnalyticsPeriodBoundary> | null>(null)
    const [abpIndex, setAbpIndex] = useState<number | null>(null)

    const { input } = useField<Partial<AnalyticsPeriodBoundary>[]>(
        'analyticsPeriodBoundaries'
    )
    const { value, onBlur, onChange } = input

    const closeModal = () => {
        setModalAPB(null)
        setAbpIndex(null)
    }

    const onRemoveAPB = useCallback(
        (index: number) => () => {
            onChange(value.filter((_, i) => i !== index))
            onBlur()
        },
        [onChange, onBlur, value]
    )

    const onSaveAPB = useCallback(
        (editedApb: Partial<AnalyticsPeriodBoundary>) => {
            if (abpIndex !== null) {
                const copy = [...value]
                copy[abpIndex] = editedApb
                onChange(copy)
            }
            onBlur()
            closeModal()
        },
        [onChange, onBlur, value, abpIndex]
    )

    return (
        <>
            <Button
                small
                onClick={() => {
                    setModalAPB({})
                    setAbpIndex(value.length)
                }}
                dataTest="add-boundary-button"
            >
                {i18n.t('Add a period boundary')}
            </Button>
            {modalAPB && (
                <AnalyticsPeriodBoundaryModal
                    APB={modalAPB}
                    closeModal={closeModal}
                    onSaveAPB={onSaveAPB}
                />
            )}
            {value &&
                value.map(
                    (apb: Partial<AnalyticsPeriodBoundary>, index: number) => (
                        <>
                            <APBItem
                                apb={apb}
                                key={apb.id ?? `new-apb-${index}`}
                                onRemove={onRemoveAPB(index)}
                                onEdit={(value) => {
                                    setModalAPB(value)
                                    setAbpIndex(index)
                                }}
                            />
                        </>
                    )
                )}
        </>
    )
}
