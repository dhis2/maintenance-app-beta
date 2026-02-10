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

    if (modelId) {
        const actions: ProgramRuleActionListItem[] =
            actionsFieldArray.value ?? []

        return (
            <>
                <DrawerPortal isOpen={drawerState.open} onClose={closeDrawer}>
                    {drawerState.open && (
                        <ProgramRuleActionForm
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
                            const actionKey = action.id ?? `new-${index}`
                            if (action.deleted) {
                                return (
                                    <div
                                        key={actionKey}
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
                                id: actionKey,
                                displayName:
                                    getProgramRuleActionListLabel(action),
                            }

                            return (
                                <ListInFormItem
                                    key={actionKey}
                                    item={displayItem}
                                    schemaName={SchemaName.programRuleAction}
                                    onClick={() => openEdit(action, index)}
                                    onDelete={() => handleDelete(index)}
                                />
                            )
                        })}
                    </div>

                    <div className={styles.addActionButton}>
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
