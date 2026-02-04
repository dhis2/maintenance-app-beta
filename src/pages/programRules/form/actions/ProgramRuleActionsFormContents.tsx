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
import css from './ProgramRuleActionsFormContents.module.css'
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
                    {i18n.t('Configure actions for this program rule.')}
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

    // Merge submitted action into form array (edit = update at index, add = push)
    const handleSubmitted = (values: ProgramRuleActionListItem) => {
        // Ensure new actions have a temporary id for React list keys
        const actionWithId = {
            ...values,
            id: values.id || crypto.randomUUID(),
        }

        if (drawerState.index !== null) {
            actionsFieldArray.update(drawerState.index, actionWithId)
        } else {
            actionsFieldArray.push(actionWithId)
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
    if (!modelId) {
        return (
            <NoticeBox className={css.formTypeInfo}>
                {i18n.t(
                    'Program rule must be saved before actions can be added'
                )}
            </NoticeBox>
        )
    }

    const actions = actionsFieldArray.value ?? []

    return (
        <>
            <DrawerPortal isOpen={drawerState.open} onClose={closeDrawer}>
                {drawerState.open && (
                    <div>
                        <ProgramRuleActionForm
                            programRuleId={modelId}
                            programId={programId}
                            action={drawerState.action}
                            onCancel={closeDrawer}
                            onSubmitted={handleSubmitted}
                        />
                    </div>
                )}
            </DrawerPortal>

            <div className={css.listWrapper}>
                <div className={css.sectionItems}>
                    {actions.map((action, index) => {
                        // Use id or fallback to index for React key
                        const key = action.id || `action-${index}`

                        if (action.deleted) {
                            return (
                                <div
                                    className={css.actionCardDeleted}
                                    key={key}
                                >
                                    <div className={css.deletedActionText}>
                                        {i18n.t(
                                            'Action will be removed on save'
                                        )}
                                    </div>
                                    <Button
                                        small
                                        onClick={() => handleRestore(index)}
                                    >
                                        {i18n.t('Restore action')}
                                    </Button>
                                </div>
                            )
                        }

                        // ListInFormItem expects ListItem (id, displayName, access); we build displayName from action type + content/fields
                        const displayItem = {
                            ...action,
                            id: action.id || key, // Ensure id exists for ListInFormItem
                            displayName: getProgramRuleActionListLabel(action),
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

                <div>
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
