import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import isEqual from 'lodash/isEqual'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
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

type BaseOnSubmit = FormBaseProps<PartialNotificationFormValues>['onSubmit']

type OnSubmitWithClose = (
    values: Parameters<BaseOnSubmit>[0],
    form: Parameters<BaseOnSubmit>[1],
    options?: Parameters<BaseOnSubmit>[2],
    closeOnSubmit?: boolean
) => ReturnType<BaseOnSubmit>

const EMPTY_NOTIFICATION_LIST: { id: string }[] = []

export type NotificationFormActions = {
    save: () => void
    saveAndClose: () => void
}

export type NotificationFormProps = {
    notification?: PartialNotificationFormValues
    onCancel?: () => void
    onSubmit: OnSubmitWithClose
    onActionsReady?: (actions: NotificationFormActions) => void
}

const NotificationFormActionsHandler = ({
    onActionsReady,
    setCloseOnSubmit,
}: {
    onActionsReady?: (actions: NotificationFormActions) => void
    setCloseOnSubmit: (value: boolean) => void
}) => {
    const form = useForm()

    useEffect(() => {
        onActionsReady?.({
            saveAndClose: () => {
                setCloseOnSubmit(true)
                form.submit()
            },
            save: () => {
                setCloseOnSubmit(false)
                form.submit()
            },
        })
    }, [onActionsReady, setCloseOnSubmit, form])

    return null
}

export const NotificationForm = ({
    notification,
    onSubmit,
    onCancel,
    onActionsReady,
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
    const setCloseOnSubmit = useCallback((value: boolean) => {
        closeOnSubmitRef.current = value
    }, [])
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
                const showInlineFooter = !onActionsReady

                return (
                    <SectionedFormProvider
                        formDescriptor={programNotificationFormDescriptor}
                    >
                        <NotificationFormActionsHandler
                            onActionsReady={onActionsReady}
                            setCloseOnSubmit={setCloseOnSubmit}
                        />
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
                                    {showInlineFooter && (
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
                                                    {i18n.t(
                                                        'Save notification'
                                                    )}
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
                                    )}
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
    onActionsReady,
}: {
    notification: DisplayableModel
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: NotificationFormActions) => void
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
            onActionsReady={onActionsReady}
        />
    )
}

export const NewNotificationForm = ({
    onCancel,
    onSubmitted,
    onActionsReady,
    notificationList = EMPTY_NOTIFICATION_LIST,
}: {
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: NotificationFormActions) => void
    notificationList?: { id: string }[]
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
            onActionsReady={onActionsReady}
        />
    )
}

export const EditOrNewNotificationForm = ({
    notification,
    onCancel,
    onSubmitted,
    onActionsReady,
    notificationList = EMPTY_NOTIFICATION_LIST,
}: {
    notification: DisplayableModel | null | undefined
    onCancel: () => void
    onSubmitted: (
        values: SubmittedNotificationFormValues,
        closeOnSubmit: boolean
    ) => void
    onActionsReady?: (actions: NotificationFormActions) => void
    notificationList?: { id: string }[]
}) => {
    if (notification === undefined) {
        return null
    }

    if (notification === null) {
        return (
            <NewNotificationForm
                onSubmitted={onSubmitted}
                onCancel={onCancel}
                onActionsReady={onActionsReady}
                notificationList={notificationList}
            />
        )
    }

    return (
        <EditNotificationForm
            notification={notification}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
            onActionsReady={onActionsReady}
        />
    )
}
