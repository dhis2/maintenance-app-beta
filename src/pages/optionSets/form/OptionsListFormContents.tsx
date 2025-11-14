import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { OptionListNewOrEdit } from './OptionsList'

export const OptionsListFormContents = React.memo(
    function OptionSetSetupFormContents({
        name,
        manuallyDeleted,
    }: {
        name: string
        manuallyDeleted: string
    }) {
        const schemaSection = useSchemaSectionHandleOrThrow()

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Define options for this option set.')}
                </StandardFormSectionDescription>
                <OptionListNewOrEdit manuallyDeleted={manuallyDeleted} />
            </SectionedFormSection>
        )
    }
)
