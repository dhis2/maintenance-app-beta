import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconAdd16,
    IconArrowDown16,
    IconArrowUp16,
    IconMore16,
} from '@dhis2/ui'
import React from 'react'
import { StandardFormSectionTitle } from '../../../../components'
import { DataSetFormValues } from '../dataSetFormSchema'
import { useDataSetField } from '../formHooks'
import css from './SectionForm.module.css'

type Section = DataSetFormValues['sections'][number]
export const SectionFormSectionsList = () => {
    const sections = useDataSetField('sections').input.value
    console.log({ sections })
    const sectionsArray = (sections || []).concat({
        id: 'new',
        displayName: i18n.t('New section'),
        type: 'section',
        description: 'Hello',
        displayOptions: {
            showHeader: true,
            showLabel: true,
            showDescription: true,
            showHelpText: true,
            showLegend: true,
        },
    })
    return (
        <div className={css.sectionsList}>
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Sections')}
                </StandardFormSectionTitle>
                <p className={css.description}>
                    {i18n.t('Configure data and options for form sections.')}
                </p>
            </div>
            <div>
                {sectionsArray.map((section, i) => (
                    <SectionItem
                        key={section.id}
                        section={section}
                        index={i}
                        totalSections={sectionsArray.length}
                    />
                ))}
            </div>
            <div>
                <Button secondary small icon={<IconAdd16 />}>
                    {i18n.t('Add section')}
                </Button>
            </div>
        </div>
    )
}

export const SectionItem = ({
    section,
    index,
    totalSections,
}: {
    section: Section
    index: number
    totalSections: number
}) => {
    return (
        <div className={css.sectionItem}>
            <div className={css.sectionIdentifiers}>
                <div className={css.sectionName}>{section.displayName}</div>
                {section.description && (
                    <div className={css.sectionDescription}>
                        {section.description}
                    </div>
                )}
            </div>
            <div className={css.sectionActions}>
                <Button
                    icon={<IconArrowUp16 />}
                    secondary
                    disabled={index === 0}
                />
                <Button
                    icon={<IconArrowDown16 />}
                    secondary
                    disabled={index === totalSections - 1}
                />
                <Button icon={<IconMore16 />} secondary />
            </div>
        </div>
    )
}
