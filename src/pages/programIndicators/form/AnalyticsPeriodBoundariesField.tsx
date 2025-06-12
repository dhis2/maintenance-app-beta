import i18n from '@dhis2/d2-i18n'
import { Button, Input, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React, { useCallback, useMemo } from 'react'
import { Field, useField } from 'react-final-form'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'
import { AnalyticsPeriodBoundary } from '../../../types/generated'
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
    onChange,
}: {
    apb: Partial<AnalyticsPeriodBoundary>
    onRemove: () => void
    onChange: (apb: Partial<AnalyticsPeriodBoundary>) => void
}) => {
    const foundBoundaryTarget = useMemo(
        () =>
            boundaryTargets.find((e) => e.value === apb.boundaryTarget)?.value,
        [apb]
    )

    const renderCustom = useMemo(
        () => apb.boundaryTarget !== undefined && !foundBoundaryTarget,
        [apb, foundBoundaryTarget]
    )

    return (
        <div className={classes.analyticsPeriodBoundary}>
            <div className={classes.analyticsPeriodBoundaryInputs}>
                <SingleSelectField
                    selected={renderCustom ? 'CUSTOM' : foundBoundaryTarget}
                    onChange={({ selected }) => {
                        onChange({ ...apb, boundaryTarget: selected })
                    }}
                    label={i18n.t('Boundary target')}
                >
                    <SingleSelectOption label={'<No value>'} value={''} />
                    {boundaryTargets.map((option) => (
                        <SingleSelectOption key={option.value} {...option} />
                    ))}
                </SingleSelectField>
                {renderCustom && (
                    <Input
                        placeholder={i18n.t('Custom boundary text')}
                        onChange={(e) =>
                            onChange({ ...apb, boundaryTarget: e.value })
                        }
                        value={apb.boundaryTarget}
                    />
                )}
                <SingleSelectField
                    selected={apb.analyticsPeriodBoundaryType}
                    onChange={({ selected }) => {
                        onChange({
                            ...apb,
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
                <Input
                    type="number"
                    placeholder={i18n.t('Offset period by amount')}
                    onChange={(e) =>
                        onChange({
                            ...apb,
                            offsetPeriods: e.value
                                ? parseInt(e.value)
                                : undefined,
                        })
                    }
                    value={apb.offsetPeriods?.toString()}
                    dense
                    min={'0'}
                />
                <PeriodTypeSelect
                    selected={apb.offsetPeriodType}
                    onChange={(selected) => {
                        onChange({
                            ...apb,
                            offsetPeriodType: selected as offsetPeriodType,
                        })
                    }}
                    noValueOption
                />
            </div>
            <Button small secondary destructive onClick={onRemove}>
                {i18n.t('Remove')}
            </Button>
        </div>
    )
}

const AnalyticsPeriodBoundariesList = ({
    input,
}: {
    input: {
        value: Partial<AnalyticsPeriodBoundary>[]
        onChange: (value: Partial<AnalyticsPeriodBoundary>[]) => void
        onBlur: () => void
    }
}) => {
    const { value, onBlur, onChange } = input

    const onRemove = useCallback(
        (index: number) => () => {
            onChange(value.filter((_, i) => i !== index))
            onBlur()
        },
        [onChange, onBlur, value]
    )

    const onItemChange = useCallback(
        (index: number) => (editedApb: Partial<AnalyticsPeriodBoundary>) => {
            onChange(value.map((apb, i) => (index === i ? editedApb : apb)))
            onBlur()
        },
        [onChange, onBlur, value]
    )

    return (
        <>
            {value &&
                value.map((apb, index) => (
                    <APBItem
                        apb={apb}
                        key={apb.id ?? `new-apb-${index}`}
                        onRemove={onRemove(index)}
                        onChange={onItemChange(index)}
                    />
                ))}
        </>
    )
}

export const AnalyticsPeriodBoundariesField = () => {
    const { input } = useField<Partial<AnalyticsPeriodBoundary>[]>(
        'analyticsPeriodBoundaries'
    )
    return (
        <>
            <AnalyticsPeriodBoundariesList input={input} />
            <Button
                small
                onClick={() => {
                    input.onChange([...input.value, {}])
                }}
            >
                {i18n.t('Add a new boundary')}
            </Button>
        </>
    )
}
