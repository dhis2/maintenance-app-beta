import i18n from '@dhis2/d2-i18n'
import { MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useField, useForm } from 'react-final-form'

export const ATTRIBUTE_TRANSLATIONS: Record<string, string> = {
    categoryAttribute: i18n.t('Category'),
    categoryOptionAttribute: i18n.t('Category option'),
    categoryOptionComboAttribute: i18n.t('Category option combo'),
    categoryOptionGroupAttribute: i18n.t('Category option group'),
    categoryOptionGroupSetAttribute: i18n.t('Category option group set'),
    constantAttribute: i18n.t('Constant'),
    dataElementAttribute: i18n.t('Data element'),
    dataElementGroupAttribute: i18n.t('Data element group'),
    dataElementGroupSetAttribute: i18n.t('Data element group set'),
    dataSetAttribute: i18n.t('Data set'),
    documentAttribute: i18n.t('Document'),
    eventChartAttribute: i18n.t('Event chart'),
    eventReportAttribute: i18n.t('Event report'),
    indicatorAttribute: i18n.t('Indicator'),
    indicatorGroupAttribute: i18n.t('Indicator group'),
    legendSetAttribute: i18n.t('Legend set'),
    mapAttribute: i18n.t('Map'),
    optionAttribute: i18n.t('Option'),
    optionSetAttribute: i18n.t('Option set'),
    organisationUnitAttribute: i18n.t('Organisation unit'),
    organisationUnitGroupAttribute: i18n.t('Organisation unit group'),
    organisationUnitGroupSetAttribute: i18n.t('Organisation unit group set'),
    programAttribute: i18n.t('Program'),
    programIndicatorAttribute: i18n.t('Program indicator'),
    programStageAttribute: i18n.t('Program stage'),
    relationshipTypeAttribute: i18n.t('Relationship type'),
    sectionAttribute: i18n.t('Section'),
    sqlViewAttribute: i18n.t('SQL view'),
    trackedEntityAttributeAttribute: i18n.t('Tracked entity attribute'),
    trackedEntityTypeAttribute: i18n.t('Tracked entity type'),
    userAttribute: i18n.t('User'),
    userGroupAttribute: i18n.t('User group'),
    validationRuleAttribute: i18n.t('Validation rule'),
    validationRuleGroupAttribute: i18n.t('Validation rule group'),
    visualizationAttribute: i18n.t('Visualization'),
}

export const ATTRIBUTE_BOOLEANS = Object.keys(ATTRIBUTE_TRANSLATIONS)

const useGetInputs = () => {
    const { input: categoryAttributeInput } = useField('categoryAttribute')
    const { input: categoryOptionAttributeInput } = useField(
        'categoryOptionAttribute'
    )
    const { input: categoryOptionComboAttributeInput } = useField(
        'categoryOptionComboAttribute'
    )
    const { input: categoryOptionGroupAttributeInput } = useField(
        'categoryOptionGroupAttribute'
    )
    const { input: categoryOptionGroupSetAttributeInput } = useField(
        'categoryOptionGroupSetAttribute'
    )
    const { input: constantAttributeInput } = useField('constantAttribute')
    const { input: dataElementAttributeInput } = useField(
        'dataElementAttribute'
    )
    const { input: dataElementGroupAttributeInput } = useField(
        'dataElementGroupAttribute'
    )
    const { input: dataElementGroupSetAttributeInput } = useField(
        'dataElementGroupSetAttribute'
    )
    const { input: dataSetAttributeInput } = useField('dataSetAttribute')
    const { input: documentAttributeInput } = useField('documentAttribute')
    const { input: eventChartAttributeInput } = useField('eventChartAttribute')
    const { input: eventReportAttributeInput } = useField(
        'eventReportAttribute'
    )
    const { input: indicatorAttributeInput } = useField('indicatorAttribute')
    const { input: indicatorGroupAttributeInput } = useField(
        'indicatorGroupAttribute'
    )
    const { input: legendSetAttributeInput } = useField('legendSetAttribute')
    const { input: mapAttributeInput } = useField('mapAttribute')
    const { input: optionAttributeInput } = useField('optionAttribute')
    const { input: optionSetAttributeInput } = useField('optionSetAttribute')
    const { input: organisationUnitAttributeInput } = useField(
        'organisationUnitAttribute'
    )
    const { input: organisationUnitGroupAttributeInput } = useField(
        'organisationUnitGroupAttribute'
    )
    const { input: organisationUnitGroupSetAttributeInput } = useField(
        'organisationUnitGroupSetAttribute'
    )
    const { input: programAttributeInput } = useField('programAttribute')
    const { input: programIndicatorAttributeInput } = useField(
        'programIndicatorAttribute'
    )
    const { input: programStageAttributeInput } = useField(
        'programStageAttribute'
    )
    const { input: relationshipTypeAttributeInput } = useField(
        'relationshipTypeAttribute'
    )
    const { input: sectionAttributeInput } = useField('sectionAttribute')
    const { input: sqlViewAttributeInput } = useField('sqlViewAttribute')
    const { input: trackedEntityAttributeAttributeInput } = useField(
        'trackedEntityAttributeAttribute'
    )
    const { input: trackedEntityTypeAttributeInput } = useField(
        'trackedEntityTypeAttribute'
    )
    const { input: userAttributeInput } = useField('userAttribute')
    const { input: userGroupAttributeInput } = useField('userGroupAttribute')
    const { input: validationRuleAttributeInput } = useField(
        'validationRuleAttribute'
    )
    const { input: validationRuleGroupAttributeInput } = useField(
        'validationRuleGroupAttribute'
    )
    const { input: visualizationAttributeInput } = useField(
        'visualizationAttribute'
    )

    return {
        categoryAttribute: categoryAttributeInput.onChange,
        categoryOptionAttribute: categoryOptionAttributeInput.onChange,
        categoryOptionComboAttribute:
            categoryOptionComboAttributeInput.onChange,
        categoryOptionGroupAttribute:
            categoryOptionGroupAttributeInput.onChange,
        categoryOptionGroupSetAttribute:
            categoryOptionGroupSetAttributeInput.onChange,
        constantAttribute: constantAttributeInput.onChange,
        dataElementAttribute: dataElementAttributeInput.onChange,
        dataElementGroupAttribute: dataElementGroupAttributeInput.onChange,
        dataElementGroupSetAttribute:
            dataElementGroupSetAttributeInput.onChange,
        dataSetAttribute: dataSetAttributeInput.onChange,
        documentAttribute: documentAttributeInput.onChange,
        eventChartAttribute: eventChartAttributeInput.onChange,
        eventReportAttribute: eventReportAttributeInput.onChange,
        indicatorAttribute: indicatorAttributeInput.onChange,
        indicatorGroupAttribute: indicatorGroupAttributeInput.onChange,
        legendSetAttribute: legendSetAttributeInput.onChange,
        mapAttribute: mapAttributeInput.onChange,
        optionAttribute: optionAttributeInput.onChange,
        optionSetAttribute: optionSetAttributeInput.onChange,
        organisationUnitAttribute: organisationUnitAttributeInput.onChange,
        organisationUnitGroupAttribute:
            organisationUnitGroupAttributeInput.onChange,
        organisationUnitGroupSetAttribute:
            organisationUnitGroupSetAttributeInput.onChange,
        programAttribute: programAttributeInput.onChange,
        programIndicatorAttribute: programIndicatorAttributeInput.onChange,
        programStageAttribute: programStageAttributeInput.onChange,
        relationshipTypeAttribute: relationshipTypeAttributeInput.onChange,
        sectionAttribute: sectionAttributeInput.onChange,
        sqlViewAttribute: sqlViewAttributeInput.onChange,
        trackedEntityAttributeAttribute:
            trackedEntityAttributeAttributeInput.onChange,
        trackedEntityTypeAttribute: trackedEntityTypeAttributeInput.onChange,
        userAttribute: userAttributeInput.onChange,
        userGroupAttribute: userGroupAttributeInput.onChange,
        validationRuleAttribute: validationRuleAttributeInput.onChange,
        validationRuleGroupAttribute:
            validationRuleGroupAttributeInput.onChange,
        visualizationAttribute: visualizationAttributeInput.onChange,
    } as Record<string, (b: boolean) => void>
}

export const AttributeTypeComponent = ({
    initialValues,
}: {
    initialValues?: Record<string, any>
}) => {
    const form = useForm()
    const [selections, setSelections] = useState<string[] | undefined>(
        undefined
    )
    const onChanges = useGetInputs()

    // initialise selections with current form values
    useEffect(() => {
        if (initialValues) {
            setSelections(ATTRIBUTE_BOOLEANS.filter((a) => initialValues[a]))
        } else {
            setSelections([])
        }
    }, [initialValues, setSelections])

    // do not render until selections are initialised
    if (!selections) {
        return null
    }

    return (
        <MultiSelectField
            dataTest="formfields-objecttypes"
            label={i18n.t('Objects to which this attribute can be applied')}
            selected={selections}
            onChange={(s) => {
                const values = form.getState().values
                for (const attribute of ATTRIBUTE_BOOLEANS) {
                    const isSelected = s.selected.includes(attribute)
                    const currentFormValue = values[attribute]

                    if (isSelected !== currentFormValue) {
                        onChanges[attribute](isSelected)
                    }
                }
                setSelections(s.selected)
            }}
        >
            {ATTRIBUTE_BOOLEANS.map((attribute) => (
                <MultiSelectOption
                    key={attribute}
                    value={attribute}
                    label={ATTRIBUTE_TRANSLATIONS?.[attribute] ?? attribute}
                />
            ))}
        </MultiSelectField>
    )
}
