import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    FileInput,
    FileInputChangeHandler,
    FileList,
    FileListItem,
    Field as UIField,
    Help,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import css from './ImageField.module.css'

const fileToBase64 = (file: File): Promise<string> => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
    })
}

export function ImageField() {
    const dataEngine = useDataEngine()
    const fieldName = 'image'
    const { input, meta } = useField(fieldName, { format: (value) => value })

    const [fileBase64, setFileBase64] = useState<string | undefined>()

    const uploadFile = async (fileToUpload: File) => {
        const fileToUploadDetails = {
            name: fileToUpload.name,
            size: fileToUpload.size,
        }
        updateInputValue({
            ...fileToUploadDetails,
            id: undefined,
            error: undefined,
        })
        try {
            const postResponse = (await dataEngine.mutate({
                resource: 'fileResources',
                type: 'create',
                data: { file: fileToUpload, domain: 'ORG_UNIT' },
            })) as {
                response: {
                    fileResource: { id: string; storageStatus: string }
                }
            }
            updateInputValue({
                ...fileToUploadDetails,
                id: postResponse.response.fileResource.id,
                error: undefined,
            })
        } catch (e) {
            console.error(e)
            updateInputValue({
                ...fileToUploadDetails,
                id: undefined,
                error: (e as Error | string).toString(),
            })
        }
    }
    const updateInputValue = (newInputValue: {
        name: string
        size: number
        id?: string
        error?: string
    }) => {
        input.onChange(newInputValue)
        input.onBlur()
    }
    const deleteFile = () => {
        setFileBase64(undefined)
        input.onChange(undefined)
        input.onBlur()
    }
    const handleChange: FileInputChangeHandler = async ({ files }) => {
        const newFile = files[0]
        if (newFile instanceof File) {
            uploadFile(newFile)
            const file64 = await fileToBase64(newFile)
            setFileBase64(file64)
        }
    }

    return (
        <UIField
            label={i18n.t('Image')}
            name="image"
            error={meta.invalid}
            valid={meta.valid}
            validationText={input.value?.error}
        >
            <div className={css.fileInputWrapper}>
                <ImagePreview
                    fileBase64={fileBase64}
                    fileResource={input.value}
                />
                <FileInput
                    accept="image/*"
                    buttonLabel={i18n.t('Upload an image')}
                    multiple={false}
                    name={input.name}
                    onChange={handleChange}
                    error={!!(input.value && input.value.error)}
                    valid={!!(input.value && input.value.id)}
                />
            </div>
            <FileList>
                {input.value?.id && (
                    <FileListItem
                        key={input.value?.id}
                        label={input.value?.name}
                        onRemove={deleteFile}
                        removeText={i18n.t('Remove')}
                    />
                )}
            </FileList>
            <Help>
                {i18n.t(
                    'Max size 10MB. Supported file size are .jpg, .png, and .gif.'
                )}
            </Help>
        </UIField>
    )
}

const ImagePreview = ({
    fileBase64,
    fileResource,
}: {
    fileBase64?: string
    fileResource?: { id: string }
}) => {
    const baseUrl = useConfig().baseUrl

    if (fileBase64) {
        return <img src={fileBase64} alt={i18n.t('Preview of current icon')} />
    }

    if (fileResource && fileResource.id) {
        const src = `${baseUrl}/api/fileResources/${fileResource.id}/data`

        return <img src={src} alt={i18n.t('Preview of current icon')} />
    }
    return null
}
