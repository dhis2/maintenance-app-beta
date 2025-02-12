import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    OrganisationUnitField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { OrganisationUnitFormValue } from '../../../components/form/fields/OrganisationUnitField'
import { SectionedFormSection } from '../../../components/sectionedForm'
import classes from './OrganisationUnitsFormContents.module.css'

export const OrganisationUnitsFormContents = ({ name }: { name: string }) => {
    const form = useFormState()
    const formValues = form.values
    const fieldName = 'organisationUnits'

    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Organisation units')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Configure which organisation units can collect data for this data set.'
                )}
            </StandardFormSectionDescription>
            <div className={classes.organisationUnitSelectorWrapper}>
                <StandardFormField>
                    <OrganisationUnitField name={fieldName} label={''} />
                </StandardFormField>
                <div className={classes.organisationUnitSelectorRhs}>
                    <h4>
                        {!formValues[fieldName] ||
                        formValues[fieldName]?.length === 0
                            ? i18n.t('No selected units')
                            : i18n.t('{{numberOfUnits}} selected units', {
                                  numberOfUnits: formValues[fieldName]?.length,
                              })}
                    </h4>
                    {formValues[fieldName]?.map(
                        (orgUnit: OrganisationUnitFormValue) => (
                            <p key={orgUnit.id}>{orgUnit.displayName}</p>
                        )
                    )}
                </div>
            </div>
        </SectionedFormSection>
    )
}
