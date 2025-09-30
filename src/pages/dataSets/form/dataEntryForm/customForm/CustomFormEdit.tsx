import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, NoticeBox } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    FormFooterWrapper,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../../components'
import { generateDhis2Id } from '../../../../../lib'
import styles from './CustomFormContents.module.css'
import { CustomFormElementsSelector } from './CustomFormElementsSelector'

export type CustomFormProps = {
    closeCustomFormEdit?: () => void
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
        const [de, coc] = id.split('.')
        return `<p><input ${
            disabled ? 'disabled="disabled"' : ''
        } id="${de}-${coc}-val" name="entryfield" title="${name}" value="[ ${name} ]" /></p>`
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
    return ''
}

type CustomFormDataPayload = {
    id: string
    htmlCode: string
}
// when there is a data set id, we can post to the form endpoint
const useUpdateForm = ({
    onSuccess,
    onError,
}: {
    onSuccess: (data: CustomFormDataPayload) => void
    onError: (e: Error) => void
}) => {
    const id = useParams().id
    const dataEngine = useDataEngine()

    const update = useCallback(
        async (data: CustomFormDataPayload) => {
            try {
                const response = await dataEngine.mutate(
                    {
                        resource: `dataSets/${id}/form`,
                        type: 'create',
                        data: data,
                    },
                    {
                        onComplete: () => {
                            // the response from this post is empty, so we use the data we passed if it was successful
                            onSuccess(data)
                        },
                        onError,
                    }
                )
                return { data: response }
            } catch (error) {
                console.error(error)
            }
        },
        [dataEngine, id, onSuccess, onError]
    )
    return update
}

export const CustomFormEdit = ({ closeCustomFormEdit }: CustomFormProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [previewMode, setPreviewMode] = useState<boolean>(false)
    const [customFormSaving, setCustomFormSaving] = useState<boolean>(false)
    const [customFormError, setCustomFormError] = useState<string>('')
    const { input: formInput } = useField('dataEntryForm')

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
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.value = formInput?.value?.htmlCode ?? ''
    }, [formInput?.value?.htmlCode, textAreaRef])

    const { show: showSuccess } = useAlert(i18n.t('Custom form saved'), {
        success: true,
    })

    const updateCustomForm = useUpdateForm({
        onSuccess: (data) => {
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
        },
        onError: (e) => {
            setCustomFormSaving(false)
            setCustomFormError(e.message)
        },
    })

    return (
        <div className={styles.sectionsWrapper}>
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
                                'Define a custom form for this data set by editing HTML below.'
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
                                                srcDoc={
                                                    textAreaRef.current?.value
                                                }
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
                                <CustomFormElementsSelector
                                    insertElement={insertElement}
                                    previewMode={previewMode}
                                />
                            </div>
                        </div>
                    </SectionedFormSection>
                </SectionedFormSections>
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
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            type="button"
                            onClick={() => {
                                const formId =
                                    formInput?.value?.id ?? generateDhis2Id()
                                const htmlCode =
                                    textAreaRef.current?.value ?? ''
                                setCustomFormSaving(true)
                                setCustomFormError('')
                                updateCustomForm({
                                    htmlCode,
                                    id: formId,
                                })
                            }}
                            dataTest="form-submit-button"
                            disabled={customFormSaving}
                        >
                            {i18n.t('Save custom form')}
                        </Button>
                        <Button
                            secondary
                            small
                            onClick={closeCustomFormEdit}
                            dataTest="form-cancel-link"
                            disabled={customFormSaving}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                'Saving a custom form does not save other changes to the data set'
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </div>
    )
}
