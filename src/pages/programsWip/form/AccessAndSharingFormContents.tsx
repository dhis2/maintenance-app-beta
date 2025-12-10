import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    OrganisationUnitTreeWithToolbarFormField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { RoleAccessSummary } from './RoleAccessSummary/RoleAccessSummary'

export const AccessAndSharingFormContents = React.memo(
    function AccessAndSharingFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Organisation unit access')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up which organisation units can collect data using this program.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <OrganisationUnitTreeWithToolbarFormField />
                </StandardFormField>

                <StandardFormSectionTitle>
                    {i18n.t('Role access')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up which user roles can access this program and program stages.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RoleAccessSummary />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
