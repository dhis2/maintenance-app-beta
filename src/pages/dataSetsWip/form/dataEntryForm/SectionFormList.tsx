import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, IconAdd16 } from '@dhis2/ui'
import React, { useState } from 'react'
import { useFieldArray } from 'react-final-form-arrays'
import {
    StandardFormSectionTitle,
    MoreDropdownButton,
    MoreDropdownItem,
    MoreDropdownDivider,
    DrawerPortal,
} from '../../../../components'
import { TranslationDialog } from '../../../../components/sectionList/translation'
import { BaseListModel, SchemaName } from '../../../../lib'
import { DisplayableModel } from '../../../../types/models'
import { DataSetValues } from '../../Edit'
import { EditOrNewDataSetSectionForm } from './sectionForm/DataSetSectionForm'
import css from './SectionFormList.module.css'
import { SectionsOrderingModal } from './SectionsOrderingModal'

type Section = DataSetValues['sections'][number]

export const SectionFormSectionsList = () => {
    const [sectionFormOpen, setSectionFormOpen] = React.useState<
        DisplayableModel | null | undefined
    >(undefined)
    const [orderSectionsFormOpen, setOrderSectionsFormOpen] =
        React.useState(false)
    // use null as open, but new model
    const isSectionFormOpen = !!sectionFormOpen || sectionFormOpen === null
    const sectionFieldArray = useFieldArray<Section>('sections').fields

    const handleDeletedSection = (index: number) => {
        sectionFieldArray.update(index, {
            ...sectionFieldArray.value[index],
            deleted: true,
        })
    }

    const handleCancelDeletedSection = (index: number) => {
        sectionFieldArray.update(index, {
            ...sectionFieldArray.value[index],
            deleted: false,
        })
    }

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
                {sectionFormOpen !== undefined && (
                    <EditOrNewDataSetSectionForm
                        dataSetSection={sectionFormOpen}
                        onCancel={() => setSectionFormOpen(undefined)}
                        onSubmitted={handleSubmittedSection}
                    />
                )}
            </DrawerPortal>
            {orderSectionsFormOpen && (
                <SectionsOrderingModal
                    onClose={() => setOrderSectionsFormOpen(false)}
                    sections={sectionFieldArray.value}
                    onReorder={sectionFieldArray.update}
                />
            )}
            <div>
                <StandardFormSectionTitle>
                    {i18n.t('Sections')}
                </StandardFormSectionTitle>
                <p className={css.description}>
                    {i18n.t('Configure data and options for form sections.')}
                </p>
            </div>
            <div className={css.sectionItems}>
                {sectionFieldArray.value.map((section, index) => {
                    if (section.deleted) {
                        return (
                            <div
                                className={css.sectionCardDeleted}
                                key={section.id}
                            >
                                <div className={css.deletedSectionText}>
                                    {i18n.t(
                                        'Section {{sectionName}} will be removed on save',
                                        { sectionName: section.displayName }
                                    )}
                                </div>

                                <Button
                                    small
                                    onClick={() =>
                                        handleCancelDeletedSection(index)
                                    }
                                >
                                    {i18n.t('Restore section')}
                                </Button>
                            </div>
                        )
                    }
                    return (
                        <SectionItem
                            key={section.id}
                            section={section}
                            onClick={() => setSectionFormOpen(section)}
                            onDelete={() => handleDeletedSection(index)}
                        />
                    )
                })}
            </div>
            <div>
                <ButtonStrip>
                    <Button
                        secondary
                        small
                        icon={<IconAdd16 />}
                        onClick={() => setSectionFormOpen(null)}
                    >
                        {i18n.t('Add section')}
                    </Button>
                    <Button
                        secondary
                        small
                        onClick={() => setOrderSectionsFormOpen(true)}
                    >
                        {i18n.t('Reorder sections')}
                    </Button>
                </ButtonStrip>
            </div>
        </div>
    )
}

export const SectionItem = ({
    section,
    onClick,
    onDelete,
}: {
    section: Section
    onClick?: () => void
    onDelete?: () => void
}) => {
    const [translationDialogModel, setTranslationDialogModel] = useState<
        BaseListModel | undefined
    >(undefined)

    const openTranslationDialog = () => {
        if (section.access !== undefined) {
            setTranslationDialogModel(section as BaseListModel)
        }
    }

    return (
        <>
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
                        <div className={css.sectionName}>
                            {section.displayName}
                        </div>
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
                        {section.access !== undefined && (
                            <MoreDropdownItem
                                label={i18n.t('Translate')}
                                onClick={openTranslationDialog}
                            />
                        )}
                        <MoreDropdownItem
                            label={i18n.t('Copy ID')}
                            onClick={() => {
                                navigator.clipboard.writeText(section.id)
                            }}
                        />
                        <MoreDropdownDivider />
                        <MoreDropdownItem
                            label={i18n.t('Delete')}
                            destructive
                            onClick={onDelete}
                        />
                    </MoreDropdownButton>
                </div>
            </div>
            {translationDialogModel && (
                <TranslationDialog
                    model={translationDialogModel}
                    onClose={() => setTranslationDialogModel(undefined)}
                    schemaName={SchemaName.section}
                />
            )}
        </>
    )
}
