import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconAdd16,
    IconArrowDown16,
    IconArrowUp16,
    IconMore16,
} from '@dhis2/ui'
import { set } from 'lodash'
import React, { useMemo } from 'react'
import { FieldArray, useFieldArray } from 'react-final-form-arrays'
import { StandardFormSectionTitle } from '../../../../components'
import { Drawer } from '../../../../components/drawer'
import { DisplayableModel } from '../../../../types/models'
import { DataSetFormValues } from '../dataSetFormSchema'
import { useDataSetField } from '../formHooks'
import {
    EditDataSetSectionForm,
    EditorNewDataSetSectionForm,
} from './sectionForm/DataSetSectionForm'
import css from './SectionFormList.module.css'

type Section = DataSetFormValues['sections'][number]

export const SectionFormSectionsList = () => {
    const [sectionFormOpen, setSectionFormOpen] = React.useState<
        DisplayableModel | null | undefined
    >(undefined)
    // use null as open, but new model
    const isSectionFormOpen = !!sectionFormOpen || sectionFormOpen === null
    const sections = useDataSetField('sections').input.value
    const sectionFieldArray = useFieldArray<Section>('sections').fields
    const sectionsArray = sections || []

    return (
        <div className={css.sectionsList}>
            <Drawer
                isOpen={isSectionFormOpen}
                onClose={() => setSectionFormOpen(undefined)}
            >
                {isSectionFormOpen && (
                    <EditorNewDataSetSectionForm
                        dataSetSection={sectionFormOpen}
                        onCancel={() => setSectionFormOpen(undefined)}
                        onSubmitted={() => setSectionFormOpen(undefined)}
                    />
                )}
            </Drawer>
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Sections')}
                </StandardFormSectionTitle>
                <p className={css.description}>
                    {i18n.t('Configure data and options for form sections.')}
                </p>
            </div>
            <div>
                {sectionFieldArray.value.map((section, i) => (
                    <SectionItem
                        key={section.id}
                        section={section}
                        index={i}
                        totalSections={sectionsArray.length}
                        onClick={() => setSectionFormOpen(section)}
                        onMoveDown={() => sectionFieldArray.move(i, i + 1)}
                        onMoveUp={() => sectionFieldArray.move(i, i - 1)}
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
    index,
    totalSections,
    onClick,
    onMoveUp,
    onMoveDown,
}: {
    section: Section
    index: number
    totalSections: number
    onClick?: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
}) => {
    return (
        <div className={css.sectionItem}>
            <div className={css.sectionIdentifiers} onClick={onClick}>
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
                    onClick={onMoveUp}
                />
                <Button
                    icon={<IconArrowDown16 />}
                    secondary
                    disabled={index === totalSections - 1}
                    onClick={onMoveDown}
                />
                <Button icon={<IconMore16 />} secondary />
            </div>
        </div>
    )
}
