import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    FileInput,
    FileInputChangeHandler,
    FileList,
    FileListItem,
    Label,
} from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'

export function ImageField() {
    const dataEngine = useDataEngine()
    const fieldName = 'image'
    const { input } = useField(fieldName)
    const currentFile: File | undefined = input.value || undefined

    const uploadFile = async (fileToUpload: File) => {
        const ADD_NEW_FILE_RESOURCE_MUTATION = {
            resource: 'fileResources',
            type: 'create',
            data: (de: object) => de,
        } as const
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
            const postResponse = (await dataEngine.mutate(
                ADD_NEW_FILE_RESOURCE_MUTATION,
                {
                    variables: { file: fileToUpload },
                }
            )) as {
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
        input.onChange(undefined)
        input.onBlur()
    }
    const handleChange: FileInputChangeHandler = ({ files }) => {
        const newFile = files[0]
        if (newFile instanceof File) {
            uploadFile(newFile)
        }
    }

    return (
        <FieldRFF<string | undefined> name={fieldName}>
            {() => (
                <>
                    <Label htmlFor={fieldName}>{i18n.t('Image')}</Label>

                    <FileInput
                        accept="image/*"
                        buttonLabel={i18n.t('Upload an image')}
                        multiple={false}
                        name={input.name}
                        onChange={handleChange}
                        small
                        error={!!(input.value && input.value.error)}
                        valid={!!(input.value && input.value.id)}
                    />

                    <FileList>
                        {currentFile && (
                            <FileListItem
                                key={currentFile?.name}
                                label={currentFile?.name}
                                onRemove={deleteFile}
                                removeText={i18n.t('Remove')}
                            />
                        )}
                    </FileList>
                </>
            )}
        </FieldRFF>
    )
}
