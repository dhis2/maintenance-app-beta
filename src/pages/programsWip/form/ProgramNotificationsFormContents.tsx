import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, NoticeBox } from '@dhis2/ui'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import {
    DrawerHeader,
    DrawerPortal,
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ListInFormItem } from '../../../components/formCreators/SectionFormList'
import { SchemaName } from '../../../types'
import { Access, DisplayableModel } from '../../../types/models'
import {
    EditOrNewNotificationForm,
    SubmittedNotificationFormValues,
} from './programNotification/NotificationForm'
import css from './ProgramStagesForm.module.css'
import { ProgramStageListItem } from './ProgramStagesFormContents'

export type ProgramNotificationListItem = {
    id: string
    displayName: string
    deleted?: boolean
    access?: Access
    program?: { id: string }
}
type NotificationFormOpen = DisplayableModel | null | undefined

export const ProgramNotificationsFormContents = React.memo(
    function ProgramNotificationsContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <StandardFormSectionTitle>
                    {i18n.t('Notifications')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up notifications for this program.')}
                </StandardFormSectionDescription>
                <NotificationListNewOrEdit />
            </SectionedFormSection>
        )
    }
)

const ProgramNotificationListNewOrEdit = ({
    setNotificationFormOpen,
    notificationFormOpen,
}: {
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
    notificationFormOpen: NotificationFormOpen
}) => {
    const programNotificationsFieldArray =
        useFieldArray<ProgramNotificationListItem>(
            'notificationTemplates'
        ).fields
    const isNotificationFormOpen =
        !!notificationFormOpen || notificationFormOpen === null

    const handleSubmittedNotification = (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean = true
    ) => {
        const isEditNotification =
            notificationFormOpen && notificationFormOpen.id

        if (closeOnSubmit) {
            setNotificationFormOpen(undefined)
        } else if (!isEditNotification) {
            setNotificationFormOpen({
                id: values.id,
                displayName: values.displayName,
            })
        }
        if (isEditNotification) {
            const index = programNotificationsFieldArray.value.findIndex(
                (s) => s.id === notificationFormOpen.id
            )
            if (index !== -1) {
                programNotificationsFieldArray.update(index, values)
            }
        } else {
            programNotificationsFieldArray.push(values)
        }
    }

    const onCloseNotificationForm = () => {
        setNotificationFormOpen(undefined)
    }

    return (
        <>
            <DrawerPortal
                isOpen={isNotificationFormOpen}
                onClose={onCloseNotificationForm}
                header={
                    <DrawerHeader onClose={onCloseNotificationForm}>
                        {notificationFormOpen === null
                            ? i18n.t('New notification')
                            : i18n.t('Edit notification')}
                    </DrawerHeader>
                }
            >
                {notificationFormOpen !== undefined && (
                    <EditOrNewNotificationForm
                        notification={notificationFormOpen}
                        onCancel={onCloseNotificationForm}
                        onSubmitted={handleSubmittedNotification}
                        notificationList={programNotificationsFieldArray.value.map(
                            (n) => ({ id: n.id })
                        )}
                    />
                )}
            </DrawerPortal>

            {programNotificationsFieldArray.value.map((notification) => {
                return (
                    <ListInFormItem
                        key={notification.id}
                        item={notification}
                        schemaName={SchemaName.programNotificationTemplate}
                        onClick={() => setNotificationFormOpen(notification)}
                        onDelete={() => {}}
                    />
                )
            })}
        </>
    )
}

const StageNotificationListNewOrEdit = ({
    stage,
    setNotificationFormOpen,
    notificationFormOpen,
}: {
    stage: ProgramStageListItem
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
    notificationFormOpen: NotificationFormOpen
}) => {
    const [stageNotificationsFieldArray, setStageNotificationsFieldArray] =
        useState<SubmittedNotificationFormValues[]>(
            stage.notificationTemplates || []
        )
    const isNotificationFormOpen =
        !!notificationFormOpen || notificationFormOpen === null

    const handleSubmittedNotification = (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean = true
    ) => {
        const isEditNotification =
            notificationFormOpen && notificationFormOpen.id

        if (closeOnSubmit) {
            setNotificationFormOpen(undefined)
        } else if (!isEditNotification) {
            setNotificationFormOpen({
                id: values.id,
                displayName: values.displayName,
            })
        }
        if (isEditNotification) {
            const index = stageNotificationsFieldArray.findIndex(
                (s) => s.id === notificationFormOpen.id
            )
            if (index !== -1) {
                setStageNotificationsFieldArray([
                    ...stageNotificationsFieldArray.slice(0, index),
                    values,
                    ...stageNotificationsFieldArray.slice(index + 1),
                ])
            }
        } else {
            setStageNotificationsFieldArray([
                ...stageNotificationsFieldArray,
                values,
            ])
        }
    }

    const onCloseNotificationForm = () => {
        setNotificationFormOpen(undefined)
    }

    return (
        <>
            <DrawerPortal
                isOpen={isNotificationFormOpen}
                onClose={onCloseNotificationForm}
                header={
                    <DrawerHeader onClose={onCloseNotificationForm}>
                        {notificationFormOpen === null
                            ? i18n.t('New notification')
                            : i18n.t('Edit notification')}
                    </DrawerHeader>
                }
            >
                {notificationFormOpen !== undefined && (
                    <EditOrNewNotificationForm
                        notification={notificationFormOpen}
                        onCancel={onCloseNotificationForm}
                        onSubmitted={handleSubmittedNotification}
                        notificationList={stageNotificationsFieldArray.map(
                            (n) => ({ id: n.id })
                        )}
                    />
                )}
            </DrawerPortal>

            {stageNotificationsFieldArray.map((notification) => {
                return (
                    <ListInFormItem
                        key={notification.id}
                        item={notification}
                        schemaName={SchemaName.programNotificationTemplate}
                        onClick={() => setNotificationFormOpen(notification)}
                        onDelete={() => {}}
                    />
                )
            })}
        </>
    )
}

const NotificationListNewOrEdit = () => {
    const { values } = useFormState({ subscription: { values: true } })
    // TODO: might want to show the to be deleted notification with a warning instead
    const stages: ProgramStageListItem[] =
        values.programStages?.filter(
            (stage: ProgramStageListItem) => !stage.deleted
        ) || []

    const [notificationFormOpen, setNotificationFormOpen] =
        React.useState<NotificationFormOpen>()

    return (
        <>
            <div className={css.listWrapper}>
                <div className={css.sectionItems}>
                    {stages.every(
                        (s) => s?.notificationTemplates?.length === 0
                    ) &&
                        values.notificationTemplates.length === 0 && (
                            <NoticeBox className={css.formTypeInfo}>
                                {i18n.t('No notifications been added yet')}
                            </NoticeBox>
                        )}
                    <ProgramNotificationListNewOrEdit
                        setNotificationFormOpen={setNotificationFormOpen}
                        notificationFormOpen={notificationFormOpen}
                    />
                    {stages.map((stage) => (
                        <StageNotificationListNewOrEdit
                            stage={stage}
                            key={stage.id}
                            setNotificationFormOpen={setNotificationFormOpen}
                            notificationFormOpen={notificationFormOpen}
                        />
                    ))}
                </div>
                <div>
                    <Button
                        secondary
                        small
                        icon={<IconAdd16 />}
                        onClick={() => {
                            setNotificationFormOpen(null)
                        }}
                    >
                        {i18n.t('Add a notification')}
                    </Button>
                </div>
            </div>
        </>
    )
}
