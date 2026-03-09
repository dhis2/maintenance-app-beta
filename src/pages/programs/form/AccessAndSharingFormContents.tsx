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

type AccessAndSharingFormContentsProps = {
    name: string
    showStageAccess?: boolean
}

export const AccessAndSharingFormContents = React.memo(
    function AccessAndSharingFormContents({
        name,
        showStageAccess = true,
    }: AccessAndSharingFormContentsProps) {
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
                        showStageAccess
                            ? 'Set up which user roles can access this program and program stages.'
                            : 'Set up which user roles can access this program.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <RoleAccess showStageAccess={showStageAccess} />
                </StandardFormField>
            </SectionedFormSection>
        )
    }
)
