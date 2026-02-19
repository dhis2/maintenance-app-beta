import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import isEqual from 'lodash/isEqual'
import React, { useMemo } from 'react'
import { useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    DrawerBodyLayout,
    DrawerFormFooter,
    FormBase,
    FormBaseProps,
    FormFooterWrapper,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../../../components'
import { DrawerSectionedFormSidebar } from '../../../../components/drawer/DrawerSectionedFormSidebar'
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner'
import {
    createFormError,
    createJsonPatchOperations,
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useCreateModel,
    usePatchModel,
} from '../../../../lib'
import {
    DisplayableModel,
    PickWithFieldFilters,
    ProgramNotificationTemplate,
} from '../../../../types/models'
import styles from './NotificationForm.module.css'
import { programNotificationFormDescriptor } from './programNotificationFormDescriptor'
import { ProgramNotificationsFormFields } from './ProgramNotificationsFormFields'
import { initialValues, validate } from './programNotificationTemplateSchema'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'code',
    'subjectTemplate',
    'messageTemplate',
    'notificationRecipient',
    'notificationTrigger',
    'relativeScheduledDays',
    'deliveryChannels',
    'recipientUserGroup[id,displayName]',
    'notifyUsersInHierarchyOnly',
    'notifyParentOrganisationUnitOnly',
    'recipientProgramAttribute[id,displayName]',
] as const

export const notificationSchemaSection = {
    name: SchemaName.programNotificationTemplate,
    namePlural: 'programNotificationTemplates',
    title: i18n.t('Notification'),
    titlePlural: i18n.t('Notifications'),
    parentSectionKey: 'programsAndTracker',
} satisfies SchemaSection

export type NotificationFormValues = PickWithFieldFilters<
    ProgramNotificationTemplate,
    typeof fieldFilters
> & {
    program: { id: string }
}

type PartialNotificationFormValues = Partial<NotificationFormValues>
export type SubmittedNotificationFormValues = PartialNotificationFormValues &
    DisplayableModel

const NotificationFormDrawerFooter = ({
    form,
    setCloseOnSubmit,
    onCancel,
    formContent,
}: {
    form: { submit: () => void }
    setCloseOnSubmit: (value: boolean) => void
    onCancel: () => void
    formContent: React.ReactNode
}) => {
    const { submitting } = useFormState({
        subscription: { submitting: true },
    })
    return (
        <DrawerBodyLayout
            footer={
                <DrawerFormFooter
                    submitLabel={i18n.t('Save notification and close')}
                    saveLabel={i18n.t('Save notification')}
                    cancelLabel={i18n.t('Cancel')}
                    submitting={submitting ?? false}
                    onSubmitClick={() => {
                        setCloseOnSubmit(true)
                        form.submit()
                    }}
                    onSaveClick={() => {
                        setCloseOnSubmit(false)
                        form.submit()
                    }}
                    onCancelClick={onCancel}
                    infoMessage={i18n.t(
                        'Saving a notification does not save other changes to the program'
                    )}
                />
            }
        >
            {formContent}
        </DrawerBodyLayout>
    )
}

type BaseOnSubmit = FormBaseProps<PartialNotificationFormValues>['onSubmit']

type OnSubmitWithClose = (
    values: Parameters<BaseOnSubmit>[0],
    form: Parameters<BaseOnSubmit>[1],
    options?: Parameters<BaseOnSubmit>[2],
    closeOnSubmit?: boolean
) => ReturnType<BaseOnSubmit>

export type NotificationFormProps = {
    notification?: PartialNotificationFormValues
    onCancel?: () => void
    onSubmit: OnSubmitWithClose
}

export const NotificationForm = ({
    notification,
    onSubmit,
    onCancel,
}: NotificationFormProps) => {
    const programId = useParams().id as string
    const initialNotificationValues: PartialNotificationFormValues | undefined =
        useMemo(() => {
            return {
                ...(notification ?? initialValues),
                program: { id: programId },
            } as PartialNotificationFormValues
        }, [notification, programId])

    const closeOnSubmitRef = React.useRef(false)
    const setCloseOnSubmit = (value: boolean) => {
        closeOnSubmitRef.current = value
    }
    const [selectedSection, setSelectedSection] = React.useState<
        string | undefined
    >()

    return (
        <FormBase
            initialValuesEqual={isEqual}
            initialValues={initialNotificationValues}
            onSubmit={(values, form, options) =>
                onSubmit(values, form, options, closeOnSubmitRef.current)
            }
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
            validate={validate}
        >
            {({ handleSubmit, form }) => {
                const formContent = (
                    <SectionedFormProvider
                        formDescriptor={programNotificationFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={
                                <DrawerSectionedFormSidebar
                                    selectedSection={selectedSection}
                                />
                            }
                        >
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <ProgramNotificationsFormFields
                                        setSelectedSection={setSelectedSection}
                                    />
                                    <SectionedFormErrorNotice />
                                </div>
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )

                if (onCancel) {
                    return (
                        <NotificationFormDrawerFooter
                            form={form}
                            setCloseOnSubmit={setCloseOnSubmit}
                            onCancel={onCancel}
                            formContent={formContent}
                        />
                    )
                }

                return (
                    <SectionedFormProvider
                        formDescriptor={programNotificationFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={
                                <DrawerSectionedFormSidebar
                                    selectedSection={selectedSection}
                                />
                            }
                        >
                            <form onSubmit={handleSubmit}>
                                <div className={styles.sectionsWrapper}>
                                    <div>
                                        <ProgramNotificationsFormFields
                                            setSelectedSection={
                                                setSelectedSection
                                            }
                                        />
                                        <SectionedFormErrorNotice />
                                    </div>
                                    <FormFooterWrapper>
                                        <ButtonStrip>
                                            <Button
                                                primary
                                                small
                                                type="button"
                                                onClick={() => {
                                                    setCloseOnSubmit(true)
                                                    form.submit()
                                                }}
                                            >
                                                {i18n.t(
                                                    'Save notification and close'
                                                )}
                                            </Button>
                                            <Button
                                                secondary
                                                small
                                                type="button"
                                                onClick={() => {
                                                    setCloseOnSubmit(false)
                                                    form.submit()
                                                }}
                                            >
                                                {i18n.t('Save notification')}
                                            </Button>
                                            <Button
                                                secondary
                                                small
                                                onClick={onCancel}
                                            >
                                                {i18n.t('Cancel')}
                                            </Button>
                                        </ButtonStrip>
                                        <div className={styles.actionsInfo}>
                                            <IconInfo16 />
                                            <p>
                                                {i18n.t(
                                                    'Saving a notification does not save other changes to the program'
                                                )}
                                            </p>
                                        </div>
                                    </FormFooterWrapper>
                                </div>
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}

export const EditNotificationForm = ({
    notification,
    onCancel,
    onSubmitted,
}: {
    notification: DisplayableModel
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
}) => {
    const handlePatch = usePatchModel(
        notification.id,
        notificationSchemaSection.namePlural
    )

    const queryFn = useBoundResourceQueryFn()
    const { show: showSuccess } = useAlert(i18n.t('Notification form saved'), {
        success: true,
    })

    const notificationValues = useQuery({
        queryFn: queryFn<NotificationFormValues>,
        queryKey: [
            {
                resource: 'programNotificationTemplates',
                id: notification.id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ],
    })

    const onFormSubmit: OnSubmitWithClose = async (
        values,
        form,
        c,
        closeOnSubmit?: boolean
    ) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }

        showSuccess({ success: true })

        const updatedName = jsonPatchOperations.find(
            (op) => op.path === '/name' && op.op === 'replace'
        )?.value as string | undefined
        const resolvedDisplayName =
            updatedName || values?.displayName || values.name || ''

        onSubmitted?.(
            {
                ...values,
                id: notification.id,
                displayName: resolvedDisplayName,
            },
            closeOnSubmit ?? true
        )
        return undefined
    }

    if (notificationValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <NotificationForm
            notification={notificationValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const NewNotificationForm = ({
    onCancel,
    onSubmitted,
    notificationList,
}: {
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
    notificationList: { id: string }[]
}) => {
    const handleCreate = useCreateModel(notificationSchemaSection.namePlural)
    const engine = useDataEngine()

    const onFormSubmit: OnSubmitWithClose = async (
        values,
        b,
        c,
        closeOnSubmit?: boolean
    ) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        const newId = (res.data as { response: { uid: string } }).response.uid

        if (values.program?.id) {
            const patchOperations = {
                type: 'json-patch',
                resource: SECTIONS_MAP.program.namePlural,
                id: values.program.id,
                data: [
                    {
                        op: 'replace',
                        path: '/notificationTemplates',
                        value: [...notificationList, { id: newId }],
                    },
                ],
            } as const
            try {
                await engine.mutate(patchOperations)
            } catch (error) {
                return createFormError(error)
            }
        }

        onSubmitted?.(
            {
                ...values,
                id: newId,
                displayName: values?.displayName || values.name || '',
            },
            closeOnSubmit ?? true
        )
        return undefined
    }

    return (
        <NotificationForm
            notification={undefined}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const EditOrNewNotificationForm = ({
    notification,
    onCancel,
    onSubmitted,
    notificationList,
}: {
    notification: DisplayableModel | null | undefined
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
    notificationList: { id: string }[]
}) => {
    if (notification === undefined) {
        return null
    }

    if (notification === null) {
        return (
            <NewNotificationForm
                onSubmitted={onSubmitted}
                onCancel={onCancel}
                notificationList={notificationList}
            />
        )
    }

    return (
        <EditNotificationForm
            notification={notification}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
        />
    )
}
