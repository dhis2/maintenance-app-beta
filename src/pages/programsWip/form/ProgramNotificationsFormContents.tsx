import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, NoticeBox } from '@dhis2/ui'
import React, { Dispatch, SetStateAction } from 'react'
import { useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { useParams } from 'react-router-dom'
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

const DeletedItem = ({
    id,
    displayName,
    index,
    handleCancelDelete,
}: {
    id: string
    displayName: string
    index: number
    handleCancelDelete: (index: number) => void
}) => (
    <div className={css.stageCardDeleted} key={id}>
        <div className={css.deletedStageText}>
            {i18n.t(
                'Notification {{- notificationName}} will be removed on save',
                { notificationName: displayName }
            )}
        </div>

        <Button small onClick={() => handleCancelDelete(index)}>
            {i18n.t('Restore notification')}
        </Button>
    </div>
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
            const index = (
                programNotificationsFieldArray.value ?? []
            ).findIndex((s) => s.id === notificationFormOpen.id)
            if (index !== -1) {
                programNotificationsFieldArray.update(index, values)
            }
        } else {
            programNotificationsFieldArray.push(values)
        }
    }

    const handleDeletedProgramNotification = (index: number) => {
        const list = programNotificationsFieldArray.value ?? []
        programNotificationsFieldArray.update(index, {
            ...list[index],
            deleted: true,
        })
    }

    const handleCancelDeletedProgramNotification = (index: number) => {
        const list = programNotificationsFieldArray.value ?? []
        programNotificationsFieldArray.update(index, {
            ...list[index],
            deleted: false,
        })
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
                        notificationList={(
                            programNotificationsFieldArray.value ?? []
                        ).map((n) => ({ id: n.id }))}
                    />
                )}
            </DrawerPortal>

            {(programNotificationsFieldArray.value ?? []).map(
                (notification, index) => {
                    if (notification.deleted) {
                        return (
                            <DeletedItem
                                key={notification.id}
                                id={notification.id}
                                displayName={notification.displayName}
                                index={index}
                                handleCancelDelete={
                                    handleCancelDeletedProgramNotification
                                }
                            />
                        )
                    }
                    return (
                        <ListInFormItem
                            key={notification.id}
                            item={notification}
                            schemaName={SchemaName.programNotificationTemplate}
                            onClick={() =>
                                setNotificationFormOpen(notification)
                            }
                            onDelete={() =>
                                handleDeletedProgramNotification(index)
                            }
                        />
                    )
                }
            )}
        </>
    )
}

const StageNotificationListNewOrEdit = ({
    stage,
    stageIndex,
    setNotificationFormOpen,
    notificationFormOpen,
}: {
    stage: ProgramStageListItem
    stageIndex: number
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
    notificationFormOpen: NotificationFormOpen
}) => {
    const stagesFieldArray =
        useFieldArray<ProgramStageListItem>('programStages').fields
    const isNotificationFormOpen =
        !!notificationFormOpen || notificationFormOpen === null
    const notificationsArray =
        stagesFieldArray?.value?.[stageIndex]?.notificationTemplates || []

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
            const index = notificationsArray.findIndex(
                (s) => s.id === notificationFormOpen.id
            )
            if (index !== -1) {
                const updatedStageNotifications = [
                    ...notificationsArray.slice(0, index),
                    { ...values, name: values?.name ?? values.displayName },
                    ...notificationsArray.slice(index + 1),
                ]
                stagesFieldArray.update(stageIndex, {
                    ...stage,
                    notificationTemplates: updatedStageNotifications,
                })
            }
        } else {
            const updatedStageNotifications = [
                ...notificationsArray,
                { ...values, name: values?.name ?? values.displayName },
            ]
            stagesFieldArray.update(stageIndex, {
                ...stage,
                notificationTemplates: updatedStageNotifications,
            })
        }
    }

    const handleDeletedProgramStageNotification = (index: number) => {
        const updatedStageNotifications = [
            ...notificationsArray.slice(0, index),
            { ...notificationsArray[index], deleted: true },
            ...notificationsArray.slice(index + 1),
        ]
        stagesFieldArray.update(stageIndex, {
            ...stage,
            notificationTemplates: updatedStageNotifications,
        })
    }

    const handleCancelDeletedProgramStageNotification = (index: number) => {
        const updatedStageNotifications = [
            ...notificationsArray.slice(0, index),
            { ...notificationsArray[index], deleted: false },
            ...notificationsArray.slice(index + 1),
        ]
        stagesFieldArray.update(stageIndex, {
            ...stage,
            notificationTemplates: updatedStageNotifications,
        })
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
                        notificationList={notificationsArray.map((n) => ({
                            id: n.id,
                        }))}
                    />
                )}
            </DrawerPortal>

            {notificationsArray.map((notification, index) => {
                if (notification.deleted) {
                    return (
                        <DeletedItem
                            key={notification.id}
                            index={index}
                            id={notification.id}
                            displayName={notification.displayName}
                            handleCancelDelete={
                                handleCancelDeletedProgramStageNotification
                            }
                        />
                    )
                }
                return (
                    <ListInFormItem
                        key={notification.id}
                        item={notification}
                        schemaName={SchemaName.programNotificationTemplate}
                        onClick={() => setNotificationFormOpen(notification)}
                        onDelete={() => {
                            handleDeletedProgramStageNotification(index)
                        }}
                    />
                )
            })}
        </>
    )
}

const NotificationListNewOrEdit = () => {
    const modelId = useParams().id as string
    const { values } = useFormState({ subscription: { values: true } })
    // TODO: might want to show the to be deleted notification with a warning instead
    const stages: ProgramStageListItem[] =
        values?.programStages?.filter(
            (stage: ProgramStageListItem) => !stage.deleted
        ) || []

    const [notificationFormOpen, setNotificationFormOpen] =
        React.useState<NotificationFormOpen>()

    if (!modelId) {
        return (
            <NoticeBox className={css.formTypeInfo}>
                {i18n.t(
                    'Program must be saved before notifications can be added'
                )}
            </NoticeBox>
        )
    }

    return (
        <>
            <div className={css.listWrapper}>
                <div className={css.sectionItems}>
                    {stages.every(
                        (s) => s?.notificationTemplates?.length === 0
                    ) &&
                        (values?.notificationTemplates?.length ?? 0) === 0 && (
                            <NoticeBox className={css.formTypeInfo}>
                                {i18n.t('No notifications have been added yet')}
                            </NoticeBox>
                        )}
                    <ProgramNotificationListNewOrEdit
                        setNotificationFormOpen={setNotificationFormOpen}
                        notificationFormOpen={notificationFormOpen}
                    />
                    {stages.map((stage, index) => (
                        <StageNotificationListNewOrEdit
                            stage={stage}
                            key={stage.id}
                            setNotificationFormOpen={setNotificationFormOpen}
                            notificationFormOpen={notificationFormOpen}
                            stageIndex={index}
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
