import i18n from '@dhis2/d2-i18n'
import { IconInfo16, NoticeBox, Tab, TabBar } from '@dhis2/ui'
import React from 'react'
import { TooltipWrapper } from '../tooltip'
import classes from './TabbedFormTypePicker.module.css'

const disabledFormTypeText = i18n.t(
    'You need to save before this form type can be configured.'
)

export enum FormType {
    DEFAULT = 'DEFAULT',
    CUSTOM = 'CUSTOM',
    SECTION = 'SECTION',
}

export const TabbedFormTypePicker = React.memo(function FormFormContents({
    selectedFormType,
    onFormTypeChange,
    sectionsLength,
    hasDataEntryForm,
    hasDataToDisplay,
    modelId,
    children,
}: {
    selectedFormType: FormType
    onFormTypeChange: (formType: FormType) => void
    sectionsLength: number
    hasDataEntryForm: boolean
    hasDataToDisplay: boolean
    modelId?: string
    children: React.ReactNode
}) {
    const isCreatingNew = !modelId
    const androidFormType =
        sectionsLength > 0 ? i18n.t('Section form') : i18n.t('Basic form')

    const basicFormHelpText = i18n.t(
        'Basic forms display an auto-generated list.'
    )

    const webFormType = hasDataEntryForm
        ? i18n.t('Custom form')
        : androidFormType

    return (
        <>
            {!isCreatingNew && hasDataToDisplay && (
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
                            onFormTypeChange(FormType.DEFAULT)
                        }}
                        selected={selectedFormType === FormType.DEFAULT}
                    >
                        <div className={classes.formTypeTab}>
                            {i18n.t('Basic form')}
                            <TooltipWrapper
                                condition
                                className={classes.infoTooltipWrapper}
                                content={i18n.t(
                                    `${basicFormHelpText} \n` +
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
                            onFormTypeChange(FormType.SECTION)
                        }}
                        disabled={isCreatingNew}
                        selected={selectedFormType === FormType.SECTION}
                    >
                        <TooltipWrapper
                            condition={isCreatingNew}
                            content={disabledFormTypeText}
                        >
                            <div className={classes.formTypeTab}>
                                {i18n.t('Section form')}
                                <TooltipWrapper
                                    condition={!isCreatingNew}
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
                            onFormTypeChange(FormType.CUSTOM)
                        }}
                        disabled={isCreatingNew}
                        selected={selectedFormType === FormType.CUSTOM}
                    >
                        <TooltipWrapper
                            condition={isCreatingNew}
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
                                    condition={!isCreatingNew}
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
            <div className={classes.formTypeTabsContent}>{children}</div>
        </>
    )
})
