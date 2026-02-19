import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, NoticeBox } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useEffect, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import {
    Drawer,
    DrawerFormFooter,
    FormFooterWrapper,
    SectionedFormErrorNotice,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '..'
import { generateDhis2Id } from '../../lib'
import styles from './CustomFormContents.module.css'
import {
    LoadingCustomFormElementsSelector,
    ElementTypes,
} from './CustomFormElementsSelector'

export type CustomFormProps = {
    closeCustomFormEdit?: () => void
    loading: boolean
    refetch: () => void
    elementTypes: ElementTypes
    updateCustomForm: (
        data: CustomFormDataPayload,
        onSuccess: (data: CustomFormDataPayload) => void,
        onError: (e: Error) => void,
        existingFormId: string | undefined
    ) => Promise<unknown>
    customFormTarget: string
}

const SubsectionSpacer = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.formSectionSpacing}>{children}</div>
)

const getElementText = ({
    id,
    name,
    type,
    disabled,
}: {
    id: string
    name?: string
    type: string
    disabled?: boolean
}): string => {
    if (type === 'dataElement') {
        const [de, parent] = id.split('.')
        const formattedId =
            parent === undefined ? `${de}-val` : `${de}-${parent}-val`
        return `<p><input ${
            disabled ? 'disabled="disabled"' : ''
        } id="${formattedId}" name="entryfield" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'total') {
        return `<p><input dataelementid="${id}" ${
            disabled ? 'disabled="disabled"' : ''
        } id="total${id}" name="total" readonly="readonly" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'indicator') {
        return `<p><input ${
            disabled ? 'disabled="disabled"' : ''
        } id="indicator${id}" indicatorid="${id}" name="indicator" readonly="readonly" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'flag') {
        return `<p><img src="../dhis-web-commons/flags/${id}.png" /></p>`
    }
    if (type === 'attribute') {
        return `<p><input attributeid="${id}" title="${name}" value="[ ${name} ]" /></p>`
    }
    if (type === 'program') {
        return `<p><input programid="${id}" title="${name}" value="[ ${name} ]" /></p>`
    }
    return ''
}

export type CustomFormDataPayload = {
    id: string
    htmlCode: string
    name?: string
}

export const CustomFormEdit = ({
    closeCustomFormEdit,
    loading,
    refetch,
    elementTypes,
    updateCustomForm,
    customFormTarget,
}: CustomFormProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [previewMode, setPreviewMode] = useState<boolean>(false)
    const [customFormSaving, setCustomFormSaving] = useState<boolean>(false)
    const [customFormError, setCustomFormError] = useState<string>('')
    const { input: formInput } = useField('dataEntryForm')
    const { input: nameInput } = useField('name')

    const insertElement = ({
        id,
        name,
        type,
        disabled,
    }: {
        id: string
        name?: string
        type: string
        disabled: boolean
    }) => {
        if (textAreaRef.current) {
            const elementText = getElementText({ id, name, type, disabled })

            const cursorStartIndex = textAreaRef.current?.selectionStart ?? 0
            const startText = textAreaRef.current?.value.slice(
                0,
                cursorStartIndex
            )
            const endText = textAreaRef.current?.value.slice(cursorStartIndex)
            const newText = `${startText}${elementText}${endText}`
            textAreaRef.current.value = newText
        }
    }

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.value = formInput?.value?.htmlCode ?? ''
    }, [formInput?.value?.htmlCode, textAreaRef])

    const { show: showSuccess } = useAlert(i18n.t('Custom form saved'), {
        success: true,
    })

    const onSuccess = (data: CustomFormDataPayload) => {
        showSuccess({ success: true })
        // update form state
        formInput.onChange({
            ...formInput.value,
            ...data,
        })

        // close module
        if (closeCustomFormEdit) {
            closeCustomFormEdit()
        }
    }

    const onError = (e: Error) => {
        setCustomFormSaving(false)
        setCustomFormError(e.message)
    }

    const handleSave = () => {
        const formId = formInput?.value?.id ?? generateDhis2Id()
        const htmlCode = textAreaRef.current?.value ?? ''
        setCustomFormSaving(true)
        setCustomFormError('')
        const data = formInput?.value?.id
            ? { htmlCode, id: formId }
            : {
                  htmlCode,
                  id: formId,
                  name: nameInput?.value,
              }
        updateCustomForm(data, onSuccess, onError, formInput?.value?.id)
    }

    const formContent = (
        <div>
            <SectionedFormSections>
                <SectionedFormSection name="customFormEdit">
                    <StandardFormSectionTitle>
                        {previewMode
                            ? i18n.t('Custom form (preview)')
                            : i18n.t('Custom form')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            `Define a custom form for this {{customFormTarget}} by editing HTML below.`,
                            { customFormTarget }
                        )}
                    </StandardFormSectionDescription>
                    <div
                        className={
                            customFormError?.length > 0
                                ? styles.customFormEditContainerWithError
                                : styles.customFormEditContainer
                        }
                    >
                        <div className={styles.customFormInputContainer}>
                            <Button
                                className={styles.formSectionSpacing}
                                small
                                onClick={() => {
                                    setPreviewMode((prev) => !prev)
                                }}
                            >
                                {previewMode
                                    ? i18n.t('Edit')
                                    : i18n.t('Preview')}
                            </Button>
                            {previewMode && (
                                <SubsectionSpacer>
                                    {textAreaRef?.current?.value?.length ===
                                    0 ? (
                                        <NoticeBox warning>
                                            {i18n.t('Nothing to preview')}
                                        </NoticeBox>
                                    ) : (
                                        <iframe
                                            srcDoc={textAreaRef.current?.value}
                                            className={styles.iframeStyling}
                                            title={i18n.t(
                                                'Preview of custom form'
                                            )}
                                            sandbox="allow-same-origin"
                                        ></iframe>
                                    )}
                                </SubsectionSpacer>
                            )}

                            <textarea
                                className={
                                    previewMode
                                        ? styles.textAreaHidden
                                        : styles.textAreaStyling
                                }
                                ref={textAreaRef}
                            ></textarea>
                        </div>
                        <div className={styles.customFormElementsContainer}>
                            <LoadingCustomFormElementsSelector
                                insertElement={insertElement}
                                previewMode={previewMode}
                                loading={loading}
                                elementTypes={elementTypes}
                            />
                        </div>
                    </div>
                </SectionedFormSection>
            </SectionedFormSections>
            <SectionedFormErrorNotice />
            {customFormError?.length > 0 && (
                <div className={styles.errorNoticeWrapper}>
                    <NoticeBox
                        error
                        title={i18n.t(
                            'Something went wrong when submitting the form'
                        )}
                    >
                        {customFormError}
                    </NoticeBox>
                </div>
            )}
        </div>
    )

    if (closeCustomFormEdit) {
        return (
            <Drawer
                footer={
                    <DrawerFormFooter
                        submitLabel={i18n.t('Save custom form')}
                        cancelLabel={i18n.t('Cancel')}
                        submitting={customFormSaving}
                        onSubmitClick={handleSave}
                        onCancelClick={closeCustomFormEdit}
                        infoMessage={i18n.t(
                            `Saving a custom form does not save other changes to the {{customFormTarget}}`,
                            { customFormTarget }
                        )}
                    />
                }
            >
                {formContent}
            </Drawer>
        )
    }

    return (
        <div className={styles.sectionsWrapper}>
            {formContent}
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            type="button"
                            dataTest="form-submit-button"
                            disabled={customFormSaving}
                            onClick={handleSave}
                        >
                            {i18n.t('Save custom form')}
                        </Button>
                        {closeCustomFormEdit && (
                            <Button
                                secondary
                                small
                                onClick={closeCustomFormEdit}
                                dataTest="form-cancel-link"
                                disabled={customFormSaving}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                        )}
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                `Saving a custom form does not save other changes to the {{customFormTarget}}`,
                                { customFormTarget }
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </div>
    )
}
