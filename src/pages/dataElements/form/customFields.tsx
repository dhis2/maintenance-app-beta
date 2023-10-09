import i18n from '@dhis2/d2-i18n'
import {
    ButtonStrip,
    Button,
    Field,
    Radio,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import React, { useRef } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useHref } from 'react-router'
import {
    AggregationLevelMultiSelect,
    ColorAndIconPicker,
    CategoryComboSelect,
    OptionSetSelect,
    LegendSetTransfer,
} from '../../../components'
import { AGGREGATION_TYPE, DOMAIN_TYPE, VALUE_TYPE } from '../../../constants'
import { useSchemas } from '../../../lib'
import classes from './customFields.module.css'
import { EditableFieldWrapper } from './EditableFieldWrapper'

export function ColorAndIconField() {
    const { input: colorInput } = useField('style.color')
    const { input: iconInput } = useField('style.icon')

    return (
        <Field
            dataTest="dataelementsformfields-colorandicon"
            label={i18n.t('Color and icon')}
            helpText={i18n.t(
                'A color and icon are helpful for identifying data elements in information-dense screens.'
            )}
        >
            <ColorAndIconPicker
                icon={iconInput.value}
                color={colorInput.value}
                onIconPick={({ icon }: { icon: string }) => {
                    iconInput.onChange(icon)
                }}
                onColorPick={({ color }: { color: string }) => {
                    colorInput.onChange(color)
                }}
            />
        </Field>
    )
}

export function DomainField() {
    const name = 'domainType'
    const validate = (value: string) => (!value ? 'Required' : undefined)
    const aggregateInput = useField(name, {
        type: 'radio',
        value: 'AGGREGATE',
        validate,
    })
    const trackerInput = useField(name, {
        type: 'radio',
        value: 'TRACKER',
        validate,
    })
    const error = aggregateInput.meta.error || trackerInput.meta.error

    return (
        <Field
            required
            dataTest="dataelementsformfields-domaintype"
            name={name}
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Domain'),
            })}
            helpText={i18n.t(
                'A data element can either be aggregated or tracked data.'
            )}
            error={!!error}
            validationText={error}
        >
            <div>
                <Radio
                    {...aggregateInput.input}
                    className={classes.domainTypeRadioButton}
                    label={DOMAIN_TYPE.AGGREGATE}
                    onChange={(
                        _: object,
                        e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                        aggregateInput.input.onChange(e)
                    }}
                />

                <Radio
                    {...trackerInput.input}
                    label={DOMAIN_TYPE.TRACKER}
                    className={classes.domainTypeRadioButton}
                    onChange={(
                        _: object,
                        e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                        trackerInput.input.onChange(e)
                    }}
                />
            </div>
        </Field>
    )
}

export function LegendSetField() {
    const name = 'legendSets'
    const { input, meta } = useField(name, {
        multiple: true,
        format: (legendSets: { id: string }[]) =>
            legendSets?.map((legendSet) => legendSet.id),
        parse: (ids: string[]) => ids.map((id) => ({ id })),
    })

    const newLegendSetLink = useHref('/legendSets/new')
    const legendSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    const rightHeader = (
        <p className={classes.legendsPickedHeader}>
            {i18n.t('Selected legends')}
        </p>
    )

    const leftFooter = (
        <div className={classes.legendsOptionsFooter}>
            <ButtonStrip>
                <Button small onClick={legendSetHandle.current.refetch}>
                    {i18n.t('Refresh list')}
                </Button>

                <Button
                    small
                    onClick={() => window.open(newLegendSetLink, '_blank')}
                >
                    {i18n.t('Add new')}
                </Button>
            </ButtonStrip>
        </div>
    )

    return (
        <Field
            dataTest="dataelementsformfields-legendsets"
            error={!!meta.error}
            validationText={meta.error?.toString()}
            name={name}
        >
            <LegendSetTransfer
                ref={legendSetHandle}
                selected={input.value}
                onChange={({ selected }) => input.onChange(selected)}
                rightHeader={rightHeader}
                leftFooter={leftFooter}
            />
        </Field>
    )
}

export function ValueTypeField() {
    const schemas = useSchemas()
    const { dataElement } = schemas
    const options = dataElement.properties.valueType.constants?.map(
        (constant) => ({
            value: constant,
            label: VALUE_TYPE[constant as keyof typeof VALUE_TYPE],
        })
    )
    return (
        <FieldRFF
            component={SingleSelectFieldFF}
            dataTest="dataelementsformfields-valuetype"
            required
            validate={(value: string) => (!value ? 'Required' : undefined)}
            inputWidth="400px"
            name="valueType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Value type'),
            })}
            helpText={i18n.t('The type of data that will be recorded.')}
            options={options || []}
        />
    )
}

export function AggregationTypeField() {
    const { dataElement } = useSchemas()
    const options = dataElement.properties.aggregationType.constants?.map(
        (constant) => ({
            value: constant,
            label: AGGREGATION_TYPE[constant as keyof typeof AGGREGATION_TYPE],
        })
    )

    return (
        <FieldRFF
            component={SingleSelectFieldFF}
            dataTest="dataelementsformfields-aggregationtype"
            required
            validate={(value: string) => (!value ? 'Required' : undefined)}
            inputWidth="400px"
            name="aggregationType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Aggregation type'),
            })}
            helpText={i18n.t(
                'The default way to aggregate this data element in analytics.'
            )}
            options={options || []}
        />
    )
}

export function CategoryComboField() {
    const newCategoryComboLink = useHref('/categoryCombos/new')
    const { input, meta } = useField('categoryCombo.id')
    const categoryComboHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="dataelementsformfields-categorycombo"
            onRefresh={() => categoryComboHandle.current.refetch()}
            onAddNew={() => window.open(newCategoryComboLink, '_blank')}
        >
            <div className={classes.categoryComboSelect}>
                <Field
                    required
                    validate={(value: string) =>
                        !value ? 'Required' : undefined
                    }
                    name="categoryCombo.id"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Category combination'),
                    })}
                    helpText={i18n.t(
                        'Choose how this data element is disaggregated'
                    )}
                    validationText={meta.error}
                >
                    <CategoryComboSelect
                        placeholder=""
                        ref={categoryComboHandle}
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}

export function OptionSetField() {
    const newOptionSetLink = useHref('/optionSets/new')
    const { input, meta } = useField('optionSet.id')
    const optionSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="dataelementsformfields-optionset"
            onRefresh={() => optionSetHandle.current.refetch()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <div className={classes.optionSetSelect}>
                <Field
                    name="optionSet.id"
                    label={i18n.t('Option set')}
                    helpText={i18n.t(
                        'Choose a set of predefined options for data entry'
                    )}
                    validationText={meta.error}
                >
                    <OptionSetSelect
                        placeholder=""
                        ref={optionSetHandle}
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}

export function OptionSetCommentField() {
    const newOptionSetLink = useHref('/optionSets/new')
    const { input, meta } = useField('commentOptionSet.id')
    const optionSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="dataelementsformfields-commentoptionset"
            onRefresh={() => optionSetHandle.current.refetch()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <div className={classes.optionSetSelect}>
                <Field
                    name="commentOptionSet.id"
                    label={i18n.t('Option set comment')}
                    helpText={i18n.t(
                        'Choose a set of predefined comment for data entry'
                    )}
                    validationText={meta.error}
                >
                    <OptionSetSelect
                        ref={optionSetHandle}
                        placeholder=""
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}

export function AggregationLevelsField() {
    const newAggregationLevelLink = useHref('/organisationUnitLevel/new')
    const { input, meta } = useField('aggregationLevels', {
        multiple: true,
        format: (levels: number[]) => levels.map((level) => level.toString()),
        parse: (levels: string[]) => levels.map((level) => parseInt(level, 10)),
    })
    const aggregationLevelHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="dataelementsformfields-aggregationlevels"
            onRefresh={() => aggregationLevelHandle.current.refetch()}
            onAddNew={() => window.open(newAggregationLevelLink, '_blank')}
        >
            <div className={classes.optionSetSelect}>
                <Field
                    name="aggregationLevels"
                    label={i18n.t('Aggregation level(s)')}
                    helpText={i18n.t(
                        'Choose how this data element is disaggregated'
                    )}
                    validationText={meta.error}
                >
                    <AggregationLevelMultiSelect
                        ref={aggregationLevelHandle}
                        inputWidth="400px"
                        placeholder=""
                        selected={input.value}
                        onChange={({ selected }) => input.onChange(selected)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        onRetryClick={() =>
                            aggregationLevelHandle.current.refetch()
                        }
                    />
                </Field>
            </div>
        </EditableFieldWrapper>
    )
}
