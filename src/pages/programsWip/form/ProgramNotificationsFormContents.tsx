import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, NoticeBox } from '@dhis2/ui'
import React, { Dispatch, SetStateAction } from 'react'
import { useFieldArray } from 'react-final-form-arrays'
import { useParams } from 'react-router-dom'
import {
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

export type DisplayableModelAndStageId = DisplayableModel & { stageId?: string }
type NotificationFormOpen = DisplayableModelAndStageId | null | undefined

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
}: {
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
}) => {
    const programNotificationsFieldArray =
        useFieldArray<ProgramNotificationListItem>(
            'notificationTemplates'
        ).fields

    const handleDeletedProgramNotification = (index: number) => {
        programNotificationsFieldArray.update(index, {
            ...programNotificationsFieldArray.value[index],
            deleted: true,
        })
    }

    const handleCancelDeletedProgramNotification = (index: number) => {
        programNotificationsFieldArray.update(index, {
            ...programNotificationsFieldArray.value[index],
            deleted: false,
        })
    }

    return (
        <>
            {programNotificationsFieldArray.value.map((notification, index) => {
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
                        onClick={() => setNotificationFormOpen(notification)}
                        onDelete={() => handleDeletedProgramNotification(index)}
                    />
                )
            })}
        </>
    )
}

const StageNotificationListNewOrEdit = ({
    stageIndex,
    setNotificationFormOpen,
}: {
    stageIndex: number
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
}) => {
    const stagesFieldArray =
        useFieldArray<ProgramStageListItem>('programStages').fields

    const notificationsArray =
        stagesFieldArray?.value?.[stageIndex]?.notificationTemplates || []

    const handleDeletedProgramStageNotification = (index: number) => {
        const updatedStageNotifications = [
            ...notificationsArray.slice(0, index),
            { ...notificationsArray[index], deleted: true },
            ...notificationsArray.slice(index + 1),
        ]
        stagesFieldArray.update(stageIndex, {
            ...stagesFieldArray?.value?.[stageIndex],
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
            ...stagesFieldArray?.value?.[stageIndex],
            notificationTemplates: updatedStageNotifications,
        })
    }

    // TODO: might want to show the to be deleted notification with a warning instead
    if (stagesFieldArray.value[stageIndex]?.deleted) {
        return
    }

    return (
        <>
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

    const stagesFieldArray =
        useFieldArray<ProgramStageListItem>('programStages').fields

    const programNotificationsFieldArray =
        useFieldArray<ProgramNotificationListItem>(
            'notificationTemplates'
        ).fields

    const [notificationFormOpen, setNotificationFormOpen] =
        React.useState<NotificationFormOpen>()

    const isNotificationFormOpen =
        !!notificationFormOpen || notificationFormOpen === null

    const onCloseNotificationForm = () => {
        setNotificationFormOpen(undefined)
    }

    const updateNotificationArrays = (
        notificationValues: SubmittedNotificationFormValues,
        isEditNotification: boolean,
        openNotificationId: string | undefined
    ) => {
        const stageId = notificationValues?.programStage?.id

        if (!isEditNotification && stageId === undefined) {
            programNotificationsFieldArray.push(notificationValues)
            return
        }

        if (!isEditNotification) {
            const stageIndex = stagesFieldArray.value.findIndex(
                (s) => s.id === stageId
            )
            if (stageIndex === -1) {
                return
            }
            const updatedStage = {
                ...stagesFieldArray.value[stageIndex],
                notificationTemplates: [
                    ...(stagesFieldArray.value[stageIndex]
                        ?.notificationTemplates || []),
                    {
                        ...notificationValues,
                        name:
                            notificationValues?.name ??
                            notificationValues.displayName,
                    },
                ],
            }

            stagesFieldArray.update(stageIndex, updatedStage)
            return
        }

        if (stageId) {
            const stageIndex = stagesFieldArray.value.findIndex(
                (s) => s.id === stageId
            )
            if (stageIndex === -1) {
                return
            }

            const stage = stagesFieldArray.value[stageIndex]
            const stageNotifications = stage.notificationTemplates || []

            const notificationIndex = (
                stage.notificationTemplates ?? []
            ).findIndex((s) => s.id === openNotificationId)
            if (notificationIndex === -1) {
                return
            }

            const updatedStageNotifications = [
                ...stageNotifications.slice(0, notificationIndex),
                {
                    ...stageNotifications[notificationIndex],
                    ...notificationValues,
                    name:
                        notificationValues?.name ??
                        notificationValues.displayName,
                },
                ...stageNotifications.slice(notificationIndex + 1),
            ]

            stagesFieldArray.update(stageIndex, {
                ...stage,
                notificationTemplates: updatedStageNotifications,
            })
            return
        }

        const index = programNotificationsFieldArray.value.findIndex(
            (s) => s.id === openNotificationId
        )

        if (index !== -1) {
            programNotificationsFieldArray.update(index, {
                ...programNotificationsFieldArray.value[index],
                ...notificationValues,
            })
        }
    }

    const handleSubmittedNotification = (
        notificationValues: SubmittedNotificationFormValues,
        closeOnSubmit: boolean = true
    ) => {
        const openNotification = notificationFormOpen
        const isEditNotification = Boolean(openNotification?.id)
        updateNotificationArrays(
            notificationValues,
            isEditNotification,
            openNotification?.id
        )

        if (closeOnSubmit) {
            setNotificationFormOpen(undefined)
        } else if (!isEditNotification) {
            setNotificationFormOpen({
                id: notificationValues.id,
                displayName: notificationValues.displayName,
            })
        }
    }

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
            <DrawerPortal
                isOpen={isNotificationFormOpen}
                onClose={onCloseNotificationForm}
            >
                {notificationFormOpen !== undefined && (
                    <div>
                        <EditOrNewNotificationForm
                            notification={notificationFormOpen}
                            onCancel={onCloseNotificationForm}
                            onSubmitted={handleSubmittedNotification}
                            programNotificationList={programNotificationsFieldArray.value.map(
                                (n) => ({ id: n.id })
                            )}
                            stagesNotificationList={Object.fromEntries(
                                stagesFieldArray.value.map((stage) => [
                                    stage.id,
                                    stage.notificationTemplates?.map((n) => ({
                                        id: n.id,
                                    })) ||
                                        ([] as SubmittedNotificationFormValues[]),
                                ])
                            )}
                        />
                    </div>
                )}
            </DrawerPortal>
            <div className={css.listWrapper}>
                <div className={css.sectionItems}>
                    {stagesFieldArray.value.every(
                        (s) =>
                            !s?.notificationTemplates ||
                            s?.notificationTemplates?.length === 0 ||
                            s.deleted
                    ) &&
                        programNotificationsFieldArray.value.length === 0 && (
                            <NoticeBox className={css.formTypeInfo}>
                                {i18n.t('No notifications have been added yet')}
                            </NoticeBox>
                        )}
                    {stagesFieldArray.value.map((stage, index) => (
                        <StageNotificationListNewOrEdit
                            key={stage.id}
                            setNotificationFormOpen={(notification) =>
                                setNotificationFormOpen({
                                    ...notification,
                                    stageId: stage.id,
                                } as NotificationFormOpen)
                            }
                            stageIndex={index}
                        />
                    ))}
                    <ProgramNotificationListNewOrEdit
                        setNotificationFormOpen={setNotificationFormOpen}
                    />
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
