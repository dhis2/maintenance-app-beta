import i18n from '@dhis2/d2-i18n'
import { MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-final-form'

const ATTRIBUTE_TRANSLATIONS: Record<string, string> = {
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

export const AttributeTypeComponent = ({
    setOverrideSaveFields,
    initialValues,
}: {
    setOverrideSaveFields?: React.Dispatch<React.SetStateAction<string[]>>
    initialValues?: Record<string, any>
}) => {
    const form = useForm()
    const [selections, setSelections] = useState<string[] | undefined>(
        undefined
    )

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
            label={i18n.t('Objects to which this attribute can be applied')}
            selected={selections}
            onChange={(s) => {
                const values = form.getState().values
                for (const attribute of ATTRIBUTE_BOOLEANS) {
                    const isSelected = s.selected.includes(attribute)
                    const currentFormValue = values[attribute]
                    if (isSelected !== currentFormValue) {
                        form.change(attribute, isSelected)
                        if (setOverrideSaveFields) {
                            setOverrideSaveFields((prev: string[]) => [
                                ...prev.filter((a) => a !== attribute),
                                attribute,
                            ])
                        }
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
