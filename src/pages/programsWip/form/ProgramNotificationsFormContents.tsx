import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, NoticeBox } from '@dhis2/ui'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useFormState } from 'react-final-form'
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
    NotificationFormValues,
    SubmittedNotificationFormValues,
} from './programNotification/NotificationForm'
import css from './ProgramStagesForm.module.css'
import {
    ProgramStageListItem,
    StageNotificationTemplate,
} from './ProgramStagesFormContents'

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

const ProgramNotificationListNewOrEdit = ({
    setNotificationFormOpen,
    notifications,
}: {
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
    notifications: NotificationFormValues[]
}) => {
    return (
        <>
            {notifications.map((notification) => {
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
}: {
    stage: ProgramStageListItem
    setNotificationFormOpen: Dispatch<SetStateAction<NotificationFormOpen>>
}) => {
    const stageNotificationsFieldArray = stage.notificationTemplates || []

    return (
        <>
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

function replaceAtIndex<T>(array: T[], index: number, value: T): T[] {
    if (index < 0 || index >= array.length) {
        return array
    }
    return [...array.slice(0, index), value, ...array.slice(index + 1)]
}

const NotificationListNewOrEdit = () => {
    const { values } = useFormState({ subscription: { values: true } })

    const [stages, setStages] = useState<ProgramStageListItem[]>(
        values.programStages?.filter(
            (stage: ProgramStageListItem) => !stage.deleted
        ) || []
    )
    const [programNotifications, setProgramNotifications] = useState<
        NotificationFormValues[]
    >(values.notificationTemplates || [])

    const [notificationFormOpen, setNotificationFormOpen] =
        React.useState<NotificationFormOpen>()

    const isNotificationFormOpen =
        !!notificationFormOpen || notificationFormOpen === null

    const onCloseNotificationForm = () => {
        setNotificationFormOpen(undefined)
    }

    const handleSubmittedNotification = (
        notificationValues: SubmittedNotificationFormValues,
        closeOnSubmit: boolean = true
    ) => {
        const openNotification = notificationFormOpen
        const isEditNotification = Boolean(openNotification?.id)

        if (closeOnSubmit) {
            setNotificationFormOpen(undefined)
        } else if (!isEditNotification) {
            setNotificationFormOpen({
                id: notificationValues.id,
                displayName: notificationValues.displayName,
            })
        }

        const stageId = notificationValues?.programStage?.id
        const openNotificationId = openNotification?.id

        if (!isEditNotification && stageId === undefined) {
            setProgramNotifications((prev: NotificationFormValues[]) => [
                ...prev,
                notificationValues as NotificationFormValues,
            ])
            return
        }

        if (!isEditNotification) {
            const stageIndex = stages.findIndex((s) => s.id === stageId)
            if (stageIndex === -1) {
                return
            }
            const updatedStage = {
                ...stages[stageIndex],
                notificationTemplates: [
                    ...(stages[stageIndex]?.notificationTemplates || []),
                    notificationValues as StageNotificationTemplate,
                ],
            }
            setStages((prev) => replaceAtIndex(prev, stageIndex, updatedStage))
            return
        }

        if (stageId) {
            const stageIndex = stages.findIndex((s) => s.id === stageId)
            if (stageIndex === -1) {
                return
            }

            const stage = stages[stageIndex]
            const templates = stage.notificationTemplates || []

            const index = (stage.notificationTemplates ?? []).findIndex(
                (s) => s.id === openNotificationId
            )
            if (index === -1) {
                return
            }

            const updatedTemplates = replaceAtIndex(templates, index, {
                ...templates[index],
                ...notificationValues,
            })

            const updatedStage: ProgramStageListItem = {
                ...stage,
                notificationTemplates: updatedTemplates,
            }

            setStages((prev) => replaceAtIndex(prev, stageIndex, updatedStage))
            return
        }

        setProgramNotifications((prev) => {
            const notificationIndex = prev.findIndex(
                (s: NotificationFormValues) => s.id === openNotificationId
            )
            if (notificationIndex === -1) {
                return prev
            }

            return replaceAtIndex(prev, notificationIndex, {
                ...prev[notificationIndex],
                ...notificationValues,
            })
        })
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
                            programNotificationList={programNotifications.map(
                                (n: NotificationFormValues) => ({ id: n.id })
                            )}
                            stagesNotificationList={Object.fromEntries(
                                stages.map((stage) => [
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
                    {stages.every(
                        (stage) => stage?.notificationTemplates?.length === 0
                    ) &&
                        programNotifications.length === 0 && (
                            <NoticeBox className={css.formTypeInfo}>
                                {i18n.t('No notifications been added yet')}
                            </NoticeBox>
                        )}
                    {stages.map((stage) => (
                        <StageNotificationListNewOrEdit
                            stage={stage}
                            key={stage.id}
                            setNotificationFormOpen={(notification) =>
                                setNotificationFormOpen({
                                    ...notification,
                                    stageId: stage.id,
                                } as NotificationFormOpen)
                            }
                        />
                    ))}
                    <ProgramNotificationListNewOrEdit
                        setNotificationFormOpen={setNotificationFormOpen}
                        notifications={programNotifications}
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
