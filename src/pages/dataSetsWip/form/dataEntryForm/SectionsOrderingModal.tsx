import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Divider,
    IconArrowDown16,
    IconArrowUp16,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React from 'react'
import { DataSetValues } from '../../Edit'
import css from './SectionsOrderingModal.module.css'

export const SectionsOrderingModal = ({
    onClose,
    sections,
    onReorder,
}: {
    onClose: () => void
    sections: DataSetValues['sections']
    onReorder: (index: number, value: DataSetValues['sections'][number]) => void
}) => {
    const [orderedSections, setOrderedSections] =
        React.useState<DataSetValues['sections']>(sections)
    const [isSaving, setIsSaving] = React.useState(false)
    const dataEngine = useDataEngine()
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )

    const saveOrdering = async () => {
        try {
            setIsSaving(true)
            for (const [index, section] of orderedSections.entries()) {
                await dataEngine.mutate({
                    resource: 'sections',
                    id: section.id,
                    type: 'json-patch',
                    data: [
                        {
                            op: 'replace',
                            path: '/sortOrder',
                            value: index,
                        },
                    ],
                })
                onReorder(index, section)
            }
            setIsSaving(false)
            saveAlert.show({
                message: i18n.t('New sections order saved successfully'),
                success: true,
            })
            onClose()
        } catch {
            setIsSaving(false)
            saveAlert.show({
                message: i18n.t('Error saving new sections order.'),
                error: true,
            })
        }
    }

    const onMove = (
        section: DataSetValues['sections'][number],
        moveIndexBy: number
    ) => {
        const newSections = [...orderedSections]
        const index = newSections.findIndex((s) => s.id === section.id)
        newSections.splice(index, 1)
        newSections.splice(index + moveIndexBy, 0, section)
        setOrderedSections(newSections)
    }

    return (
        <Modal onClose={onClose} large dataTest="bulk-sharing-dialog">
            <ModalTitle>{i18n.t('Reorder form sections')}</ModalTitle>
            <ModalContent className={css.sectionRows}>
                {orderedSections.map((section, index) => (
                    <>
                        <div key={section.id} className={css.sectionRow}>
                            {section.displayName}
                            <div className={css.sectionRowButtons}>
                                <Button
                                    small
                                    secondary
                                    icon={<IconArrowUp16 />}
                                    onClick={() => {
                                        onMove(section, -1)
                                    }}
                                    disabled={index === 0}
                                />
                                <Button
                                    small
                                    secondary
                                    icon={<IconArrowDown16 />}
                                    onClick={() => {
                                        onMove(section, 1)
                                    }}
                                    disabled={
                                        index === orderedSections.length - 1
                                    }
                                />
                            </div>
                        </div>
                        <Divider />
                    </>
                ))}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                    <Button primary onClick={saveOrdering} loading={isSaving}>
                        {i18n.t('Save section ordering')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
