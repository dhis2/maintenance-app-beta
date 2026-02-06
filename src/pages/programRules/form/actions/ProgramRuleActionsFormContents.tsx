/**
 * Actions section: list of program rule actions with add/edit/delete. Opens action form in a drawer.
 * Delete is soft-delete (restore until save); persisted actions are deleted on program rule save.
 * Structure matches ProgramStagesFormContents: SectionedFormSection + title/description + list.
 */
import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import { IconAdd16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { useParams } from 'react-router-dom'
import {
    DrawerPortal,
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { ListInFormItem } from '../../../../components/formCreators/SectionFormList'
import { SchemaName } from '../../../../types'
import { getProgramRuleActionListLabel } from './getProgramRuleActionListLabel'
import { ProgramRuleActionForm } from './ProgramRuleActionForm'
import styles from './ProgramRuleActionForm.module.css'
import type { ProgramRuleActionListItem } from './types'

export type { ProgramRuleActionListItem } from './types'

type DrawerState = {
    open: boolean
    action: ProgramRuleActionListItem | null
    index: number | null
}

export const ProgramRuleActionsFormContents = React.memo(
    function ProgramRuleActionsFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Actions')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the actions that happen when the program rule runs.'
                    )}
                </StandardFormSectionDescription>
                <ProgramRuleActionListNewOrEdit />
            </SectionedFormSection>
        )
    }
)

const ProgramRuleActionListNewOrEdit = () => {
    const modelId = useParams().id
    const { values: formValues } = useFormState({
        subscription: { values: true },
    })
    const programId = (formValues as { program?: { id?: string } })?.program?.id
    // useFieldArray requires arrayMutators on parent FormBase (see Edit.tsx)
    const actionsFieldArray =
        useFieldArray<ProgramRuleActionListItem>('programRuleActions').fields
    const [drawerState, setDrawerState] = useState<DrawerState>({
        open: false,
        action: null,
        index: null,
    })

    /** Soft-delete: mark as deleted; actual API delete happens on program rule save */
    const handleDelete = (index: number) => {
        const current = actionsFieldArray.value[index]
        if (current) {
            actionsFieldArray.update(index, { ...current, deleted: true })
        }
    }

    const handleRestore = (index: number) => {
        const current = actionsFieldArray.value[index]
        if (current) {
            actionsFieldArray.update(index, { ...current, deleted: false })
        }
    }

    const handleSubmitted = (values: ProgramRuleActionListItem) => {
        if (drawerState.index === null) {
            actionsFieldArray.push(values)
        } else {
            actionsFieldArray.update(drawerState.index, values)
        }
        setDrawerState({ open: false, action: null, index: null })
    }

    const openEdit = (action: ProgramRuleActionListItem, index: number) => {
        setDrawerState({ open: true, action, index })
    }

    const openAdd = () => {
        setDrawerState({ open: true, action: null, index: null })
    }

    const closeDrawer = () => {
        setDrawerState({ open: false, action: null, index: null })
    }

    // New rule has no id yet; API requires programRule id to create actions (AC)
    if (modelId) {
        const actions = actionsFieldArray.value ?? []

        return (
            <>
                <DrawerPortal isOpen={drawerState.open} onClose={closeDrawer}>
                    {drawerState.open && (
                        <ProgramRuleActionForm
                            programRuleId={modelId}
                            programId={programId}
                            action={drawerState.action}
                            onCancel={closeDrawer}
                            onSubmitted={handleSubmitted}
                        />
                    )}
                </DrawerPortal>

                <div>
                    <div>
                        {actions.map((action, index) => {
                            const key = action.id || `new-action-${index}`

                            if (action.deleted) {
                                return (
                                    <div
                                        key={key}
                                        className={styles.deletedActionBox}
                                    >
                                        <div
                                            className={styles.deletedActionText}
                                        >
                                            {i18n.t(
                                                'Action will be deleted when the program rule is saved.'
                                            )}
                                        </div>
                                        <Button
                                            small
                                            onClick={() => handleRestore(index)}
                                        >
                                            {i18n.t('Undo delete')}
                                        </Button>
                                    </div>
                                )
                            }

                            const displayItem = {
                                ...action,
                                id: action.id || key,
                                displayName:
                                    getProgramRuleActionListLabel(action),
                            }

                            return (
                                <ListInFormItem
                                    key={key}
                                    item={displayItem}
                                    schemaName={SchemaName.programRuleAction}
                                    onClick={() => openEdit(action, index)}
                                    onDelete={() => handleDelete(index)}
                                />
                            )
                        })}
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Button
                            secondary
                            small
                            icon={<IconAdd16 />}
                            onClick={openAdd}
                        >
                            {i18n.t('Add action')}
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <NoticeBox>
            {i18n.t('Program rule must be saved before actions can be added')}
        </NoticeBox>
    )
}
