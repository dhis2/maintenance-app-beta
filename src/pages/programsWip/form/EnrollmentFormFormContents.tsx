import i18n from '@dhis2/d2-i18n'
import { IconInfo16, NoticeBox, Tab, TabBar } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField, UseFieldConfig } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionFormSectionsList } from '../../../components/formCreators/SectionFormList'
import { TooltipWrapper } from '../../../components/tooltip'
import { SchemaName } from '../../../types'
import { DataSet } from '../../../types/generated'
import { ProgramsFromFilters } from '../Edit'
import classes from './EnrollmentFormFormContent.module.css'
import { EditOrNewEnrollmentSectionForm } from './sectionForm/EntrollmentSectionForm'
import formType = DataSet.formType

const disabledFormTypeText = i18n.t(
    'Program must be saved before this form type can be configured.'
)

const useProgramField = <T extends keyof ProgramsFromFilters>(
    name: T,
    options?: UseFieldConfig<ProgramsFromFilters[T], ProgramsFromFilters[T]>
) => useField<ProgramsFromFilters[T]>(name, options)

export const EnrollmentFormFormContents = React.memo(function FormFormContents({
    name,
}: {
    name: string
}) {
    const sections = useProgramField('programSections').input.value
    const dataEntryForm = useProgramField('dataEntryForm').input.value
    const trackedEntityAttributes = useProgramField(
        'programTrackedEntityAttributes'
    ).input.value
    const modelId = useParams().id
    const isCreatingNewProgram = !modelId
    const [selectedFormType, setSelectedFormType] = useState<formType>(
        formType.DEFAULT
    )
    const androidFormType =
        sections && sections.length > 0
            ? i18n.t('Section form')
            : i18n.t('Basic form')

    const webFormType = dataEntryForm ? i18n.t('Custom form') : androidFormType

    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Enrollment: Form', { nsSeparator: '~:~' })}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose and configure the type of form that will be used to collect information during enrollment.'
                )}
            </StandardFormSectionDescription>

            {!isCreatingNewProgram && trackedEntityAttributes.length > 0 && (
                <NoticeBox
                    title={i18n.t('Form type based on your current setup')}
                    className={classes.formTypeInfo}
                >
                    {i18n.t(
                        'Web will display {{webFormType}}  |  Android will display {{androidFormType}}',
                        {
                            webFormType,
                            androidFormType,
                        }
                    )}
                </NoticeBox>
            )}
            <div
                className={classes.formTypeTabsContainer}
                onClick={(e) => {
                    e.preventDefault()
                }}
            >
                <TabBar fixed>
                    <Tab
                        onClick={(_, event) => {
                            event.preventDefault()
                            setSelectedFormType(formType.DEFAULT)
                        }}
                        selected={selectedFormType === formType.DEFAULT}
                    >
                        <div className={classes.formTypeTab}>
                            {i18n.t('Basic form')}
                            <TooltipWrapper
                                condition
                                className={classes.infoTooltipWrapper}
                                content={i18n.t(
                                    'Basic forms display an auto-generated list of attributes. \n' +
                                        'They will be displayed only if no Section or Custom form is created.'
                                )}
                            >
                                <IconInfo16 />
                            </TooltipWrapper>
                        </div>
                    </Tab>
                    <Tab
                        onClick={(_, event) => {
                            event.preventDefault()
                            setSelectedFormType(formType.SECTION)
                        }}
                        disabled={isCreatingNewProgram}
                        selected={selectedFormType === formType.SECTION}
                    >
                        <TooltipWrapper
                            condition={isCreatingNewProgram}
                            content={disabledFormTypeText}
                        >
                            <div className={classes.formTypeTab}>
                                {i18n.t('Section form')}
                                <TooltipWrapper
                                    condition={!isCreatingNewProgram}
                                    className={classes.infoTooltipWrapper}
                                    content={i18n.t(
                                        'Section forms let you create sections to organize data items for easier entry. If a Section form is created, it will be shown instead of the Basic form.'
                                    )}
                                >
                                    <IconInfo16 />
                                </TooltipWrapper>
                            </div>
                        </TooltipWrapper>
                    </Tab>

                    <Tab
                        onClick={(_, event) => {
                            event.preventDefault()
                            setSelectedFormType(formType.CUSTOM)
                        }}
                        disabled={isCreatingNewProgram}
                        selected={selectedFormType === formType.CUSTOM}
                    >
                        <TooltipWrapper
                            condition={isCreatingNewProgram}
                            content={disabledFormTypeText}
                        >
                            <div
                                className={classes.formTypeTab}
                                onClick={(e) => {
                                    e.preventDefault()
                                }}
                            >
                                {i18n.t('Custom form')}
                                <TooltipWrapper
                                    condition={!isCreatingNewProgram}
                                    className={classes.infoTooltipWrapper}
                                    content={i18n.t(
                                        'Custom forms let you design a fully customized layout for data entry. \n' +
                                            '\n' +
                                            'On Web, Custom forms (if created) will always be shown.\n' +
                                            'Android does not support Custom forms; \n' +
                                            'instead, the Section form will be shown (if created), else the Basic form.'
                                    )}
                                >
                                    <IconInfo16 />
                                </TooltipWrapper>
                            </div>
                        </TooltipWrapper>
                    </Tab>
                </TabBar>
            </div>
            <div className={classes.formTypeTabsContent}>
                {selectedFormType === formType.SECTION && (
                    <SectionFormSectionsList
                        sectionsFieldName={'programSections'}
                        SectionFormComponent={EditOrNewEnrollmentSectionForm}
                        schemaName={SchemaName.programSection}
                    />
                )}
                {selectedFormType === formType.CUSTOM && <>TODO</>}
            </div>
        </SectionedFormSection>
    )
})
