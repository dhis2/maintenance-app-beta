import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useFormState } from 'react-final-form'
import {
    MessageFields,
    MessageVariables,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    useBoundResourceQueryFn,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../../lib'
import { DisplayableModel } from '../../../../types/models'
import { BasicInformationSection } from './BasicInformationSection'
import { notificationSchemaSection } from './NotificationForm'
import { NotificationTimingSection } from './NotificationTimingSection'
import { programNotificationFormDescriptor } from './programNotificationFormDescriptor'
import { RecipientSection } from './RecipientSection'

export const PROGRAM_CONSTANTS = {
    program_name: { label: i18n.t('Program name'), type: 'VARIABLE' },
    org_unit_name: { label: i18n.t('Organisation unit'), type: 'VARIABLE' },
    due_date: { label: i18n.t('Due date'), type: 'VARIABLE' },
    days_since_due_date: {
        label: i18n.t('Days since due date'),
        type: 'VARIABLE',
    },
    days_until_due_date: {
        label: i18n.t('Days until due date'),
        type: 'VARIABLE',
    },
    current_date: { label: i18n.t('Current date'), type: 'VARIABLE' },
} as MessageVariables

export const PROGRAM_STAGE_CONSTANTS = {
    ...PROGRAM_CONSTANTS,
    program_stage_name: {
        label: i18n.t('Program stage name'),
        type: 'VARIABLE',
    },
} as MessageVariables

type ProgramAttributesType = {
    programTrackedEntityAttributes: {
        trackedEntityAttribute: DisplayableModel
        displayName: string
    }[]
    programStages: {
        id: string
        programStageDataElements: {
            dataElement: { displayName: string; id: string }
        }[]
    }[]
}

export const ProgramNotificationsFormFields = ({
    setSelectedSection,
}: {
    setSelectedSection: (name: string) => void
}) => {
    useSyncSelectedSectionWithScroll(setSelectedSection)
    const section = notificationSchemaSection
    const descriptor =
        useSectionedFormContext<typeof programNotificationFormDescriptor>()

    const { values } = useFormState({
        subscription: { values: true },
    })

    const isStageNotification = values.programStage?.id !== undefined

    const queryFn = useBoundResourceQueryFn()

    const { data } = useQuery({
        queryFn: queryFn<ProgramAttributesType>,
        queryKey: [
            {
                resource: 'programs',
                id: values.program?.id,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[displayName,trackedEntityAttribute[id,displayName]]',
                        'programStages[id,displayName,programStageDataElements[dataElement[id,displayName]]]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const programMessageVariables: MessageVariables = useMemo(() => {
        if (data) {
            const trackedEntityAttributesVariables = Object.fromEntries(
                data.programTrackedEntityAttributes.map((att) => [
                    att.trackedEntityAttribute.id,
                    { label: att.displayName, type: 'ATTRIBUTE' },
                ])
            ) as MessageVariables
            return {
                ...PROGRAM_CONSTANTS,
                ...trackedEntityAttributesVariables,
            }
        }
        return PROGRAM_CONSTANTS
    }, [data])

    const programStageMessageVariables: MessageVariables = useMemo(() => {
        if (data) {
            const trackedEntityAttributesVariables = Object.fromEntries(
                data.programTrackedEntityAttributes.map((att) => [
                    att.trackedEntityAttribute.id,
                    { label: att.displayName, type: 'ATTRIBUTE' },
                ])
            ) as MessageVariables
            const selectedStageData = data.programStages.find(
                (stage) => stage.id === values.programStage?.id
            )

            const stageDataElements = selectedStageData
                ? (Object.fromEntries(
                      selectedStageData.programStageDataElements.map((de) => [
                          de.dataElement.id,
                          {
                              label: de.dataElement.displayName,
                              type: 'DATA_ELEMENT',
                          },
                      ])
                  ) as MessageVariables)
                : {}
            return {
                ...PROGRAM_STAGE_CONSTANTS,
                ...trackedEntityAttributesVariables,
                ...stageDataElements,
            }
        }
        return PROGRAM_CONSTANTS
    }, [data, values.programStage?.id])

    const messageVariable = useMemo(() => {
        return isStageNotification
            ? programStageMessageVariables
            : programMessageVariables
    }, [
        isStageNotification,
        programMessageVariables,
        programStageMessageVariables,
    ])

    return (
        <div>
            <SectionedFormSections>
                <SectionedFormSection
                    name={descriptor.getSection('basicInformation').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Set up the basic information for the notification template.'
                        )}
                    </StandardFormSectionDescription>
                    <BasicInformationSection
                        section={section}
                        programTemplateId={values.id}
                    />
                </SectionedFormSection>

                <SectionedFormSection
                    name={descriptor.getSection('messageContent').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Message content')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure the templates for the notification content and subject.'
                        )}
                    </StandardFormSectionDescription>
                    <MessageFields
                        messageVariables={messageVariable}
                        messageTemplateRequired={true}
                    />
                </SectionedFormSection>

                <SectionedFormSection
                    name={descriptor.getSection('notificationTiming').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Notification timing')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose what triggers the notification and when it should be sent.'
                        )}
                    </StandardFormSectionDescription>
                    <NotificationTimingSection
                        isStageNotification={isStageNotification}
                    />
                </SectionedFormSection>

                <SectionedFormSection
                    name={descriptor.getSection('recipient').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Recipient')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Choose who receives the notification.')}
                    </StandardFormSectionDescription>
                    <RecipientSection
                        isStageNotification={isStageNotification}
                    />
                </SectionedFormSection>
            </SectionedFormSections>
        </div>
    )
}
