import i18n from '@dhis2/d2-i18n' // Importing i18n here
import {
    InputField,
    InputFieldFF,
    TextAreaField,
    TextAreaFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import { getTranslatedProperty } from '../../../lib'
import { camelCaseToConstantCase } from '../../../lib/utils/caseTransformers'
import style from './translation.module.css'

interface TranslatableFieldsProps {
    translatableFields: string[]
    baseReferenceValues: Record<string, string>
    selectedLocale?: { locale: string } | undefined
}

const longTextFields = ['description', 'subjectTemplate', 'messageTemplate']

const TranslatableFields: React.FC<TranslatableFieldsProps> = ({
    translatableFields,
    baseReferenceValues,
    selectedLocale,
}) => {
    return (
        <div className={style.translateableFields}>
            <div className={style.formSection}>
                {translatableFields.map((field) => (
                    <React.Fragment key={field}>
                        {longTextFields.includes(field) ? (
                            <TextAreaField
                                className={style.rowStart}
                                label={getTranslatedProperty(field)}
                                disabled
                                value={baseReferenceValues[field]}
                            />
                        ) : (
                            <InputField
                                className={style.rowStart}
                                label={getTranslatedProperty(field)}
                                disabled
                                value={baseReferenceValues[field]}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {selectedLocale ? (
                <div className={style.formSection}>
                    {translatableFields.map((fieldName) => (
                        <Field<string | undefined>
                            className={style.row}
                            key={fieldName}
                            name={`${
                                selectedLocale.locale
                            }.${camelCaseToConstantCase(fieldName)}`}
                            component={
                                longTextFields.includes(fieldName)
                                    ? TextAreaFieldFF
                                    : InputFieldFF
                            }
                            label={getTranslatedProperty(fieldName)}
                            dataTest={`field-${fieldName}-translation`}
                        />
                    ))}
                </div>
            ) : (
                <p className={style.warnText}>
                    {i18n.t('Choose a Locale to translate from the menu above')}
                </p>
            )}
        </div>
    )
}

export default TranslatableFields
