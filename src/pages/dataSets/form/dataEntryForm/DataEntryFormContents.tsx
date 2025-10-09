import i18n from '@dhis2/d2-i18n'
import { NoticeBox, Tab, TabBar } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { SectionFormSectionsList } from '../../../../components/formCreators/SectionFormList'
import { SectionedFormSection } from '../../../../components/sectionedForm'
import { TooltipWrapper } from '../../../../components/tooltip'
import { SchemaName } from '../../../../types'
import { DataSet } from '../../../../types/generated'
import { DisplayOptionsField } from '../DisplayOptionsField'
import { useDataSetField } from '../formHooks'
import { CustomFormEditEntry } from './customForm/CustomFormEditEntry'
import classes from './DataEntryFormContents.module.css'
import { EditOrNewDataSetSectionForm } from './sectionForm'
import formType = DataSet.formType

const disabledFormTypeText = i18n.t(
    'Data set must be saved before this form type can be configured.'
)
export const DataEntryFromContents = React.memo(function FormFormContents({
    name,
}: {
    name: string
}) {
    const displayOptions = useDataSetField('displayOptions').input.value
    const sections = useDataSetField('sections').input.value
    const dataEntryForm = useDataSetField('dataEntryForm').input.value
    const dataSetElements = useDataSetField('dataSetElements').input.value
    const modelId = useParams().id
    const isCreatingNewDataSet = !modelId
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
                {i18n.t('Data entry form')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose and configure how the data entry form looks and works for this data set.'
                )}
            </StandardFormSectionDescription>

            {!isCreatingNewDataSet && dataSetElements.length > 0 && (
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
                                    'Basic forms display an auto-generated list of data elements. \n' +
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
                        disabled={isCreatingNewDataSet}
                        selected={selectedFormType === formType.SECTION}
                    >
                        <TooltipWrapper
                            condition={isCreatingNewDataSet}
                            content={disabledFormTypeText}
                        >
                            <div className={classes.formTypeTab}>
                                {i18n.t('Section form')}
                                <TooltipWrapper
                                    condition={!isCreatingNewDataSet}
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
                        disabled={isCreatingNewDataSet}
                        selected={selectedFormType === formType.CUSTOM}
                    >
                        <TooltipWrapper
                            condition={isCreatingNewDataSet}
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
                                    condition={!isCreatingNewDataSet}
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
                        sectionsFieldName={'sections'}
                        SectionFormComponent={EditOrNewDataSetSectionForm}
                        schemaName={SchemaName.section}
                    />
                )}
                {selectedFormType === formType.CUSTOM && (
                    <CustomFormEditEntry />
                )}
                {displayOptions !== undefined && (
                    <div className={classes.displayOptions}>
                        <StandardFormSectionTitle>
                            {i18n.t('Display options')}
                        </StandardFormSectionTitle>
                        <DisplayOptionsField
                            withSectionsDisplayOptions={
                                selectedFormType === DataSet.formType.SECTION
                            }
                        />
                    </div>
                )}
            </div>
        </SectionedFormSection>
    )
})
