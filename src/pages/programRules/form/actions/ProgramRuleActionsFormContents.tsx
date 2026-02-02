import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox } from '@dhis2/ui'
import { IconAdd16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { useParams } from 'react-router-dom'
import { DrawerPortal } from '../../../../components'
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

export const ProgramRuleActionsFormContents = () => {
    const modelId = useParams().id
    const { values: formValues } = useFormState({
        subscription: { values: true },
    })
    const programId = (formValues as { program?: { id?: string } })?.program?.id
    const actionsFieldArray =
        useFieldArray<ProgramRuleActionListItem>('programRuleActions').fields
    const [drawerState, setDrawerState] = useState<DrawerState>({
        open: false,
        action: null,
        index: null,
    })

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
        if (drawerState.index !== null) {
            actionsFieldArray.update(drawerState.index, values)
        } else {
            actionsFieldArray.push(values)
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

    if (!modelId) {
        return (
            <NoticeBox>
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
                <ProgramRuleActionForm
                    programRuleId={modelId}
                    programId={programId}
                    action={drawerState.action}
                    onCancel={closeDrawer}
                    onSubmitted={handleSubmitted}
                />
            </DrawerPortal>

            <div className={css.listWrapper}>
                {actions.length === 0 && (
                    <NoticeBox className={css.formTypeInfo}>
                        {i18n.t('No program rule actions have been added yet')}
                    </NoticeBox>
                )}

                <div className={css.sectionItems}>
                    {actions.map((action, index) => {
                        if (action.deleted) {
                            return (
                                <div
                                    className={css.actionCardDeleted}
                                    key={action.id}
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

                        const displayItem = {
                            ...action,
                            displayName: getProgramRuleActionListLabel(action),
                        }

                        return (
                            <ListInFormItem
                                key={action.id}
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
