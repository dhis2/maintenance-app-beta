import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    Field as UIField,
    FileInput,
    FileInputChangeHandler,
    FileList,
    FileListItem,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useField, useForm } from 'react-final-form'

const fileToBase64 = (file: File): Promise<string> => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
    })
}

const filenameToKey = (filename: string) =>
    filename
        .replace(/\.[^.]+$/, '')
        .replace(/[-\s]+/g, '_')
        .toLowerCase()

export function IconFileField() {
    const dataEngine = useDataEngine()
    const form = useForm()
    const { input, meta } = useField<string>('fileResourceId')

    const [uploading, setUploading] = useState(false)
    const [uploadedFilename, setUploadedFilename] = useState<
        string | undefined
    >()
    const [preview, setPreview] = useState<string | undefined>()

    const handleChange: FileInputChangeHandler = async ({ files }) => {
        const file = files[0]
        if (!(file instanceof File)) {
            return
        }

        setUploading(true)
        input.onChange('')
        input.onBlur()

        try {
            const response = (await dataEngine.mutate({
                resource: 'fileResources',
                type: 'create',
                data: { file, domain: 'ICON' },
            })) as { response: { fileResource: { id: string; name: string } } }

            const { id, name } = response.response.fileResource
            input.onChange(id)
            input.onBlur()

            setUploadedFilename(name)

            // Auto-populate key only if the user hasn't typed one yet
            const currentKey = form.getState().values.key
            if (!currentKey) {
                form.change('key', filenameToKey(name))
            }

            const base64 = await fileToBase64(file)
            setPreview(base64)
        } catch {
            input.onChange('')
            input.onBlur()
            setUploadedFilename(undefined)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        input.onChange('')
        input.onBlur()
        setUploadedFilename(undefined)
        setPreview(undefined)
    }

    const hasError = meta.touched && meta.invalid

    return (
        <UIField
            label={i18n.t('Icon file')}
            name="fileResourceId"
            required
            error={hasError}
            validationText={hasError ? meta.error : undefined}
        >
            {preview && (
                <img
                    src={preview}
                    alt={i18n.t('Icon preview')}
                    style={{
                        width: 48,
                        height: 48,
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
            )}
            {uploading ? (
                <CircularLoader small />
            ) : (
                <FileInput
                    accept="image/png"
                    buttonLabel={i18n.t('Upload icon')}
                    multiple={false}
                    name="iconFile"
                    onChange={handleChange}
                    error={hasError}
                />
            )}
            <FileList>
                {uploadedFilename && !uploading && (
                    <FileListItem
                        label={uploadedFilename}
                        onRemove={handleRemove}
                        removeText={i18n.t('Remove')}
                    />
                )}
            </FileList>
        </UIField>
    )
}
