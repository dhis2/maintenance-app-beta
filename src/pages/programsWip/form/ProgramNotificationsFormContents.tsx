import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useFieldArray } from 'react-final-form-arrays'
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

export type ProgramNotificationListItem = {
    id: string
    displayName: string
    deleted?: boolean
    access?: Access
    program?: { id: string }
}

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

const NotificationListNewOrEdit = () => {
    const programNotificationsFieldArray =
        useFieldArray<ProgramNotificationListItem>(
            'notificationTemplates'
        ).fields
    const [notificationFormOpen, setNotificationFormOpen] = React.useState<
        DisplayableModel | null | undefined
    >()
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
            >
                {notificationFormOpen !== undefined && (
                    <div>
                        <EditOrNewNotificationForm
                            notification={notificationFormOpen}
                            onCancel={onCloseNotificationForm}
                            onSubmitted={handleSubmittedNotification}
                        />
                    </div>
                )}
            </DrawerPortal>

            <div className={css.listWrapper}>
                {programNotificationsFieldArray.value.length === 0 && (
                    <NoticeBox className={css.formTypeInfo}>
                        {i18n.t('No notifications been added yet')}
                    </NoticeBox>
                )}

                <div className={css.sectionItems}>
                    {programNotificationsFieldArray.value.map(
                        (notification) => {
                            return (
                                <ListInFormItem
                                    key={notification.id}
                                    item={notification}
                                    schemaName={
                                        SchemaName.programNotificationTemplate
                                    }
                                    onClick={() =>
                                        setNotificationFormOpen(notification)
                                    }
                                    onDelete={() => {}}
                                />
                            )
                        }
                    )}
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
