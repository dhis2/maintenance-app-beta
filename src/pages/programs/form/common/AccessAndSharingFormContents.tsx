import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    OrganisationUnitTreeWithToolbarFormField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { SectionedFormSection } from '../../../../components/sectionedForm'
import { RoleAccess } from '../RoleAccess'
import { AccessLevelContent } from './AccessLevelContent'

type AccessAndSharingFormContentsProps = {
    name: string
    showStageAccess?: boolean
}

export const AccessAndSharingFormContents = React.memo(
    function AccessAndSharingFormContents({
        name,
        showStageAccess = true,
    }: AccessAndSharingFormContentsProps) {
        const { values } = useFormState({ subscription: { values: true } })

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Access level')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up how users can access program data outside their capture scope.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <AccessLevelContent />
                </StandardFormField>

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
                {values.id ? (
                    <StandardFormField>
                        <RoleAccess showStageAccess={showStageAccess} />
                    </StandardFormField>
                ) : (
                    <NoticeBox>
                        {i18n.t(
                            'Program must be saved to access sharing settings.'
                        )}
                    </NoticeBox>
                )}
            </SectionedFormSection>
        )
    }
)
