import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../../metadataFormControls'
import { SectionedFormSection } from '../../sectionedForm'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../standardForm'

type GroupsFormSectionProps = {
    objectName: string
    groupResource: string
    fieldName: string
    sectionedLayout?: boolean
}

export const GROUPS_SECTION_NAME = 'groups'

export function GroupsFormSection({
    objectName,
    groupResource,
    fieldName,
    sectionedLayout = false,
}: GroupsFormSectionProps) {
    const Wrapper = sectionedLayout ? SectionedFormSection : StandardFormSection

    return (
        <Wrapper name={GROUPS_SECTION_NAME}>
            <StandardFormSectionTitle>
                {i18n.t('Groups')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Choose the groups this {{objectName}} belongs to', {
                    objectName,
                })}
            </StandardFormSectionDescription>
            <StandardFormField>
                <ModelTransferField
                    dataTest={`formfields-${fieldName}`}
                    name={fieldName}
                    leftHeader={i18n.t('Available groups')}
                    rightHeader={i18n.t('Selected groups')}
                    filterPlaceholder={i18n.t('Filter available groups')}
                    filterPlaceholderPicked={i18n.t('Filter selected groups')}
                    query={{
                        resource: groupResource,
                        params: {
                            fields: ['id', 'displayName'],
                        },
                    }}
                />
            </StandardFormField>
        </Wrapper>
    )
}
