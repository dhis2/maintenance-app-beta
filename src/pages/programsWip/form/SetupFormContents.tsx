import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    Field,
    IconAdd16,
    Input,
    InputFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Field as FieldRFF, useField, useFormState } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'
import { useHref } from 'react-router'
import {
    CodeField,
    DescriptionField,
    EditableFieldWrapper,
    FeatureTypeField,
    NameField,
    SectionedFormSection,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { defaultDateTimeFormatter } from '../../../components/date'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import {
    DEFAULT_CATEGORY_COMBO,
    DEFAULT_CATEGORYCOMBO_SELECT_OPTION,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { Program } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import classes from '../../dataElements/fields/CategoryComboField.module.css'
import setupClasses from './SetupFormContents.module.css'

const EXPIRY_PERIOD_TYPE_OPTIONS = Object.entries(Program.expiryPeriodType).map(
    ([, value]) => ({ label: value, value })
)

const CATEGORY_COMBOS_QUERY = {
    resource: 'categoryCombos',
    params: {
        filter: ['dataDimensionType:eq:ATTRIBUTE'],
        fields: ['id', 'displayName', 'name'],
    },
}

const addDefaultCategoryComboTransform = <TCatCombo extends DisplayableModel>(
    catCombos: TCatCombo[]
) => [DEFAULT_CATEGORYCOMBO_SELECT_OPTION, ...catCombos]

export const SetupFormContents = React.memo(function SetupFormContents({
    name,
}: {
    name: string
}) {
    const { input: versionInput } = useField('version')
    const version = Number(versionInput.value) || 0

    const { values } = useFormState({ subscription: { values: true } })
    const refreshCategoryCombos = useRefreshModelSingleSelect({
        resource: 'categoryCombos',
    })
    const newCategoryComboLink = useHref('/categoryCombos/new')
    const { fromServerDate } = useTimeZoneConversion()
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Program Details')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Set up the basic information for this program.')}
            </StandardFormSectionDescription>
            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <ShortNameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <CodeField schemaSection={schemaSection} />
            </StandardFormField>
            <StandardFormField>
                <DescriptionField />
            </StandardFormField>
            <StandardFormField>
                <Field
                    label={i18n.t('Version')}
                    helpText={
                        values.lastUpdated
                            ? i18n.t('Last updated:  {{date}}', {
                                  date: defaultDateTimeFormatter.format(
                                      fromServerDate(values.lastUpdated)
                                  ),
                                  nsSeparator: '~:~',
                              })
                            : undefined
                    }
                >
                    <div className={setupClasses.versionFieldRow}>
                        <Input
                            value={String(version)}
                            disabled
                            width="100px"
                            dataTest="formfields-version"
                        />
                        <Button
                            small
                            icon={<IconAdd16 />}
                            onClick={() => versionInput.onChange(version + 1)}
                            dataTest="formfields-version-increment"
                            title={i18n.t('Increase version')}
                        />
                    </div>
                </Field>
            </StandardFormField>
            <StandardFormField>
                <FeatureTypeField />
            </StandardFormField>
            <StandardFormField>
                <ModelSingleSelectFormField
                    showNoValueOption
                    inputWidth="400px"
                    dataTest="formfields-relatedProgram"
                    name="relatedProgram"
                    label={i18n.t('Related program')}
                    query={{
                        resource: 'programs',
                        params: {
                            fields: ['id', 'displayName'],
                            order: ['displayName'],
                            filter: ['id:ne:' + values.id],
                        },
                    }}
                />
            </StandardFormField>
            <StandardFormField>
                <EditableFieldWrapper
                    onRefresh={() => refreshCategoryCombos()}
                    onAddNew={() => window.open(newCategoryComboLink, '_blank')}
                >
                    <div className={classes.categoryComboSelect}>
                        <ModelSingleSelectFormField
                            inputWidth={'400px'}
                            name="categoryCombo"
                            dataTest="formfields-categorycombo"
                            label={i18n.t('Category combination')}
                            helpText={i18n.t(
                                'Choose how this program is disaggregated.'
                            )}
                            query={CATEGORY_COMBOS_QUERY}
                            transform={addDefaultCategoryComboTransform}
                        />
                    </div>
                </EditableFieldWrapper>
            </StandardFormField>

            <StandardFormField>
                <ExpiryDaysWithPeriodTypeField />
            </StandardFormField>
            <StandardFormField>
                <CompleteEventsExpiryDaysField />
            </StandardFormField>
            <StandardFormField>
                <OpenDaysAfterCoEndDateField />
                <span className={setupClasses.devNote}>
                    {i18n.t(
                        '(dev note: only shown if COC is selected and has end date)'
                    )}
                </span>
            </StandardFormField>
            <StandardFormField>
                <FieldRFF
                    name="minAttributesRequiredToSearch"
                    component={InputFieldFF}
                    type="number"
                    min="0"
                    inputWidth="200px"
                    label={i18n.t(
                        'Minimum number of attributes required to search'
                    )}
                    dataTest="formfields-minattributesrequiredtosearch"
                    format={(value: unknown) =>
                        value === undefined || value === null
                            ? ''
                            : String(value)
                    }
                    parse={(value: unknown) => {
                        if (value === undefined || value === '') {
                            return 0
                        }
                        return Number.parseInt(value as string, 10)
                    }}
                />
            </StandardFormField>
            <StandardFormField>
                <FieldRFF
                    name="maxTeiCountToReturn"
                    component={InputFieldFF}
                    type="number"
                    min="0"
                    inputWidth="200px"
                    label={i18n.t(
                        'Maximum number of search results to display'
                    )}
                    helpText={i18n.t('Entering 0 shows all search results')}
                    dataTest="formfields-maxteicounttoreturn"
                    format={(value: unknown) =>
                        value === undefined || value === null
                            ? ''
                            : String(value)
                    }
                    parse={(value: unknown) => {
                        if (value === undefined || value === '') {
                            return 0
                        }
                        return Number.parseInt(value as string, 10)
                    }}
                />
            </StandardFormField>
        </SectionedFormSection>
    )
})

function ExpiryDaysWithPeriodTypeField() {
    const { input: expiryDaysInput } = useField('expiryDays', {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : Number(value),
        format: (value: number | undefined) => value?.toString() ?? '',
    })
    const expiryDaysValue = expiryDaysInput.value
    const expiryDaysNum =
        typeof expiryDaysValue === 'string'
            ? Number(expiryDaysValue)
            : expiryDaysValue
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsChecked(
            expiryDaysValue !== undefined &&
                expiryDaysValue !== null &&
                expiryDaysNum !== 0 &&
                String(expiryDaysValue) !== '0'
        )
    }, [expiryDaysValue, expiryDaysNum])

    const onCheckboxChange = ({ checked }: { checked: boolean }) => {
        setIsChecked(checked)
        if (checked) {
            expiryDaysInput.onChange(expiryDaysNum ?? 7)
        } else {
            expiryDaysInput.onChange(0)
        }
        expiryDaysInput.onBlur()
    }

    return (
        <>
            <Checkbox
                label={i18n.t(
                    'Close data entry a number of days after the end of a period'
                )}
                onChange={onCheckboxChange}
                checked={isChecked}
            />
            <div className={setupClasses.expiryDaysRow}>
                <FieldRFF
                    name="expiryDays"
                    type="number"
                    min="1"
                    parse={(value?: string) =>
                        value === undefined || value === ''
                            ? undefined
                            : Number(value)
                    }
                    format={(value: number | undefined) =>
                        value?.toString() ?? ''
                    }
                    render={({ input, meta }) => (
                        <InputFieldFF
                            input={input}
                            meta={meta as FieldMetaState<string | undefined>}
                            inputWidth="150px"
                            label={i18n.t('Number of days')}
                            dataTest="formfields-expiryDays"
                        />
                    )}
                />
                <FieldRFF
                    name="expiryPeriodType"
                    format={(value: string | undefined) => value ?? ''}
                    parse={(value: string) =>
                        value === '' ? undefined : value
                    }
                    render={({ input, meta }) => (
                        <SingleSelectFieldFF
                            input={input}
                            meta={meta}
                            inputWidth="200px"
                            label={i18n.t('Expiry period type')}
                            dataTest="formfields-expiryPeriodType"
                            options={EXPIRY_PERIOD_TYPE_OPTIONS}
                        />
                    )}
                />
            </div>
        </>
    )
}

function CompleteEventsExpiryDaysField() {
    const { input } = useField('completeEventsExpiryDays', {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : Number(value),
        format: (value: number | undefined) => value?.toString() ?? '',
    })
    const value = input.value
    const num = typeof value === 'string' ? Number(value) : value
    const isChecked =
        value !== undefined && value !== null && num !== 0 && value !== '0'
    const [checked, setChecked] = useState(isChecked)

    useEffect(() => {
        setChecked(
            value !== undefined &&
                value !== null &&
                num !== 0 &&
                String(value) !== '0'
        )
    }, [value, num])

    const onCheckboxChange = ({ checked: c }: { checked: boolean }) => {
        setChecked(c)
        if (c) {
            input.onChange(num ?? 7)
        } else {
            input.onChange(0)
        }
        input.onBlur()
    }

    return (
        <>
            <Checkbox
                label={i18n.t('Lock completed events after a number of days')}
                onChange={onCheckboxChange}
                checked={checked}
            />
            <div className={setupClasses.expiryDaysRow}>
                <FieldRFF
                    name="completeEventsExpiryDays"
                    type="number"
                    min="1"
                    parse={(v?: string) =>
                        v === undefined || v === '' ? undefined : Number(v)
                    }
                    format={(v: number | undefined) => v?.toString() ?? ''}
                    render={({ input: inp, meta: m }) => (
                        <InputFieldFF
                            input={inp}
                            meta={m as FieldMetaState<string | undefined>}
                            inputWidth="150px"
                            label={i18n.t('Number of days')}
                            dataTest="formfields-completeEventsExpiryDays"
                        />
                    )}
                />
            </div>
        </>
    )
}

function OpenDaysAfterCoEndDateField() {
    const { input } = useField('openDaysAfterCoEndDate', {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : Number(value),
        format: (value: number | undefined) => value?.toString() ?? '',
    })
    const value = input.value
    const num = typeof value === 'string' ? Number(value) : value
    const isChecked =
        value !== undefined && value !== null && num !== 0 && value !== '0'
    const [checked, setChecked] = useState(isChecked)

    useEffect(() => {
        setChecked(
            value !== undefined &&
                value !== null &&
                num !== 0 &&
                String(value) !== '0'
        )
    }, [value, num])

    const onCheckboxChange = ({ checked: c }: { checked: boolean }) => {
        setChecked(c)
        if (c) {
            input.onChange(num ?? 7)
        } else {
            input.onChange(0)
        }
        input.onBlur()
    }

    return (
        <>
            <Checkbox
                label={i18n.t(
                    'Close data entry a number of days after "Implementing partner" end date'
                )}
                onChange={onCheckboxChange}
                checked={checked}
            />
            <div className={setupClasses.expiryDaysRow}>
                <FieldRFF
                    name="openDaysAfterCoEndDate"
                    type="number"
                    min="1"
                    parse={(v?: string) =>
                        v === undefined || v === '' ? undefined : Number(v)
                    }
                    format={(v: number | undefined) => v?.toString() ?? ''}
                    render={({ input: inp, meta: m }) => (
                        <InputFieldFF
                            input={inp}
                            meta={m as FieldMetaState<string | undefined>}
                            inputWidth="150px"
                            label={i18n.t('Number of days')}
                            dataTest="formfields-openDaysAfterCoEndDate"
                        />
                    )}
                />
            </div>
        </>
    )
}
