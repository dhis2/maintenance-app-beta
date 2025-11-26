import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
} from '../../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../../lib'
import { OptionsListTable } from './OptionsListTable'

const OptionListNewOrEdit = () => {
    const modelId = useParams().id as string
    // options cannot be added until option set is saved
    if (!modelId) {
        return (
            <NoticeBox>
                {i18n.t('Option set must be saved before options can be added')}
            </NoticeBox>
        )
    }
    return <OptionsListTable />
}

export const OptionsListFormContents = React.memo(
    function OptionSetSetupFormContents({ name }: { name: string }) {
        useSchemaSectionHandleOrThrow()

        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Define options for this option set.')}
                </StandardFormSectionDescription>
                <OptionListNewOrEdit />
            </SectionedFormSection>
        )
    }
)
