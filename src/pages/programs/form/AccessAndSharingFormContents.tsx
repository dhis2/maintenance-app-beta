import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    OrganisationUnitTreeWithToolbarFormField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { RoleAccess } from './RoleAccess'

export const AccessAndSharingFormContents = React.memo(
    function AccessAndSharingFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Organisation unit access')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose which organisation units can collect data.'
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
                        'Choose which user roles can access this program and stages.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RoleAccess />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
