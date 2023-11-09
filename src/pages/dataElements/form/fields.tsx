import i18n from '@dhis2/d2-i18n'
import {
    ButtonStrip,
    Button,
    CheckboxFieldFF,
    Field,
    InputFieldFF,
    Radio,
    SingleSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React, { useRef } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useHref } from 'react-router'
import { useParams } from 'react-router-dom'
import {
    AggregationLevelMultiSelect,
    ColorAndIconPicker,
    CategoryComboSelect,
    OptionSetSelect,
    LegendSetTransfer,
} from '../../../components'
import {
    AGGREGATION_TYPE,
    DOMAIN_TYPE,
    VALUE_TYPE,
    useSchemas,
} from '../../../lib'
import classes from './customFields.module.css'
import { EditableFieldWrapper } from './EditableFieldWrapper'
import { useIsFieldValueUnique } from './useIsFieldValueUnique'

export function NameField() {
    const params = useParams()
    const dataElementId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        field: 'name',
        id: dataElementId,
    })
    const { meta } = useField('name', {
        subscription: { validating: true },
    })

    return (
        <FieldRFF
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="dataelementsformfields-name"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Name'),
            })}
            name="name"
            helpText={i18n.t(
                'A data element name should be concise and easy to recognize.'
            )}
            // Do not pass checkIsValueTaken directly, otherwise memoization
            // won't work due to additional arguments being passed
            validate={(name: string) => checkIsValueTaken(name)}
            validateFields={[]}
        />
    )
}

export function ShortNameField() {
    const params = useParams()
    const dataElementId = params.id as string
    const checkIsValueTaken = useIsFieldValueUnique({
        field: 'shortName',
        id: dataElementId,
    })
    const { meta } = useField('shortName', {
        subscription: { validating: true },
    })

    return (
        <FieldRFF
            loading={meta.validating}
            component={InputFieldFF}
            dataTest="dataelementsformfields-shortname"
            required
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Short name'),
            })}
            name="shortName"
            helpText={i18n.t('Often used in reports where space is limited')}
            // Do not pass checkIsValueTaken directly, otherwise memoization
            // won't work due to additional arguments being passed
            validate={(shortName: string) => checkIsValueTaken(shortName)}
            validateFields={[]}
        />
    )
}

export function CodeField() {
    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="dataelementsformfields-code"
            inputWidth="150px"
            name="code"
            label={i18n.t('Code')}
            validateFields={[]}
        />
    )
}

export function DescriptionField() {
    return (
        <FieldRFF
            component={TextAreaFieldFF}
            dataTest="dataelementsformfields-description"
            inputWidth="400px"
            name="description"
            label={i18n.t('Description')}
            helpText={i18n.t(
                "Explain the purpose of this data element and how it's measured."
            )}
            validateFields={[]}
        />
    )
}

export function UrlField() {
    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="dataelementsformfields-url"
            inputWidth="400px"
            name="url"
            label={i18n.t('Url')}
            helpText={i18n.t('A web link that provides extra information')}
            validateFields={[]}
        />
    )
}

export function ColorAndIconField() {
    const { input: colorInput } = useField('style.color', {
        validateFields: [],
    })
    const { input: iconInput } = useField('style.icon', {
        validateFields: [],
    })

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

export function FieldMaskField() {
    return (
        <FieldRFF
            component={InputFieldFF}
            inputWidth="400px"
            dataTest="dataelementsformfields-fieldmask"
            name="fieldMask"
            label={i18n.t('Field mask')}
            helpText={i18n.t(
                'Use a pattern to limit what information can be entered.'
            )}
            placeholder={i18n.t('e.g. 999-000-0000')}
            validateFields={[]}
        />
    )
}

export function FormNameField() {
    return (
        <FieldRFF
            component={InputFieldFF}
            dataTest="dataelementsformfields-formname"
            inputWidth="400px"
            name="formName"
            label={i18n.t('StandardForm name')}
            helpText={i18n.t(
                'An alternative name used in section or automatic data entry forms.'
            )}
            validateFields={[]}
        />
    )
}

export function ZeroIsSignificantField() {
    return (
        <FieldRFF
            component={CheckboxFieldFF}
            dataTest="dataelementsformfields-zeroissignificant"
            name="zeroIsSignificant"
            label={i18n.t('Store zero data values')}
            type="checkbox"
            validateFields={[]}
        />
    )
}

export function DomainField() {
    const name = 'domainType'
    const validate = (value: string) => (!value ? 'Required' : undefined)
    const aggregateInput = useField(name, {
        type: 'radio',
        value: 'AGGREGATE',
        validate,
        validateFields: [],
    })
    const trackerInput = useField(name, {
        type: 'radio',
        value: 'TRACKER',
        validate,
        validateFields: [],
    })
    const touched = aggregateInput.meta.touched || trackerInput.meta.touched
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
            error={touched && !!error}
            validationText={touched ? error : undefined}
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
        validateFields: [],
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
            required
            component={SingleSelectFieldFF}
            dataTest="dataelementsformfields-valuetype"
            inputWidth="400px"
            name="valueType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Value type'),
            })}
            helpText={i18n.t('The type of data that will be recorded.')}
            options={options || []}
            validateFields={[]}
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
            inputWidth="400px"
            name="aggregationType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Aggregation type'),
            })}
            helpText={i18n.t(
                'The default way to aggregate this data element in analytics.'
            )}
            options={options || []}
            validateFields={[]}
        />
    )
}

export function CategoryComboField() {
    const newCategoryComboLink = useHref('/categoryCombos/new')
    const { input, meta } = useField('categoryCombo.id', {
        validateFields: [],
    })
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
                    name="categoryCombo.id"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Category combination'),
                    })}
                    helpText={i18n.t(
                        'Choose how this data element is disaggregated'
                    )}
                    error={meta.touched && !!meta.error}
                    validationText={meta.touched ? meta.error : undefined}
                    dataTest="dataelementsformfields-categorycombo"
                >
                    <CategoryComboSelect
                        required
                        placeholder=""
                        invalid={meta.touched && !!meta.error}
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
    const { input, meta } = useField('optionSet.id', {
        validateFields: [],
    })
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
                    validationText={meta.touched ? meta.error : undefined}
                    error={meta.touched && !!meta.error}
                    dataTest="dataelementsformfields-optionset"
                >
                    <OptionSetSelect
                        placeholder=""
                        invalid={meta.touched && !!meta.error}
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
    const { input, meta } = useField('commentOptionSet.id', {
        validateFields: [],
    })
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
                    validationText={meta.touched ? meta.error : undefined}
                    error={meta.touched && !!meta.error}
                    dataTest="dataelementsformfields-commentoptionset"
                >
                    <OptionSetSelect
                        ref={optionSetHandle}
                        invalid={meta.touched && !!meta.error}
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
        validateFields: [],
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
                    validationText={meta.touched ? meta.error : undefined}
                    error={meta.touched && !!meta.error}
                    dataTest="dataelementsformfields-aggregationlevels"
                >
                    <AggregationLevelMultiSelect
                        ref={aggregationLevelHandle}
                        invalid={meta.touched && !!meta.error}
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
