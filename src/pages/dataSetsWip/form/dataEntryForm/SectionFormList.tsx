import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16 } from '@dhis2/ui'
import React from 'react'
import { useFieldArray } from 'react-final-form-arrays'
import {
    StandardFormSectionTitle,
    MoreDropdownButton,
    MoreDropdownItem,
    MoreDropdownDivider,
    DrawerPortal,
} from '../../../../components'
import { DisplayableModel } from '../../../../types/models'
import { DataSetFormValues } from '../dataSetFormSchema'
import { EditOrNewDataSetSectionForm } from './sectionForm/DataSetSectionForm'
import css from './SectionFormList.module.css'

type Section = DataSetFormValues['sections'][number]

export const SectionFormSectionsList = () => {
    const [sectionFormOpen, setSectionFormOpen] = React.useState<
        DisplayableModel | null | undefined
    >(undefined)
    // use null as open, but new model
    const isSectionFormOpen = !!sectionFormOpen || sectionFormOpen === null
    const sectionFieldArray = useFieldArray<Section>('sections').fields

    const handleSubmittedSection: React.ComponentProps<
        typeof EditOrNewDataSetSectionForm
    >['onSubmitted'] = (values) => {
        const isEditSection = sectionFormOpen && sectionFormOpen.id
        if (isEditSection) {
            const index = sectionFieldArray.value.findIndex(
                (s) => s.id === sectionFormOpen.id
            )
            if (index !== -1) {
                sectionFieldArray.update(index, values)
            }
        } else {
            sectionFieldArray.push(values)
        }
        setSectionFormOpen(undefined)
    }
    return (
        <div className={css.sectionsList}>
            <DrawerPortal
                isOpen={isSectionFormOpen}
                onClose={() => setSectionFormOpen(undefined)}
            >
                {isSectionFormOpen && (
                    <EditOrNewDataSetSectionForm
                        dataSetSection={sectionFormOpen}
                        onCancel={() => setSectionFormOpen(undefined)}
                        onSubmitted={handleSubmittedSection}
                    />
                )}
            </DrawerPortal>
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Sections')}
                </StandardFormSectionTitle>
                <p className={css.description}>
                    {i18n.t('Configure data and options for form sections.')}
                </p>
            </div>
            <div className={css.sectionItems}>
                {sectionFieldArray.value.map((section, i) => (
                    <SectionItem
                        key={section.id}
                        section={section}
                        onClick={() => setSectionFormOpen(section)}
                    />
                ))}
            </div>
            <div>
                <Button
                    secondary
                    small
                    icon={<IconAdd16 />}
                    onClick={() => setSectionFormOpen(null)}
                >
                    {i18n.t('Add section')}
                </Button>
            </div>
        </div>
    )
}

export const SectionItem = ({
    section,
    onClick,
}: {
    section: Section
    onClick?: () => void
}) => {
    return (
        <div className={css.sectionItem}>
            <div
                className={css.sectionItemClickable}
                onClick={() => {
                    // we dont want click handler on the wrapping "sectionItem" div
                    // since that will cause annoying issues with bubbling events in dropdown menu etc
                    onClick?.()
                }}
            >
                <div className={css.sectionIdentifiers}>
                    <div className={css.sectionName}>{section.displayName}</div>
                    {section.description && (
                        <div className={css.sectionDescription}>
                            {section.description}
                        </div>
                    )}
                </div>
            </div>
            <div className={css.sectionActions}>
                <MoreDropdownButton>
                    <MoreDropdownItem
                        label={i18n.t('Edit')}
                        onClick={onClick}
                    ></MoreDropdownItem>
                    <MoreDropdownItem
                        label={i18n.t('Copy ID')}
                        onClick={() => {
                            navigator.clipboard.writeText(section.id)
                        }}
                    />
                    <MoreDropdownDivider />
                    <MoreDropdownItem label={i18n.t('Delete')} destructive />
                </MoreDropdownButton>
            </div>
        </div>
    )
}
