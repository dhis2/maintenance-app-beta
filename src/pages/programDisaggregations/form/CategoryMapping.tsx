import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    IconDelete16,
    IconEdit16,
    InputFieldFF,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Input,
} from '@dhis2/ui'
import React, { useCallback, useState, ReactNode, useEffect } from 'react'
import { Field, useField, useFormState } from 'react-final-form'
import css from './CategoryMapping.module.css'
import { useValidateExpressionField } from './useFormHooks'

type CategoryOption = {
    id: string
    displayName: string
}

type MappingNameModalProps = {
    onSave: (mappingName: string) => void
    closeModal: () => void
    originalName?: string
}

const MappingNameModal = ({
    onSave,
    closeModal,
    originalName,
}: MappingNameModalProps) => {
    const [mappingName, setMappingName] = useState<string>(originalName ?? '')
    return (
        <Modal position="middle" onClose={closeModal}>
            <ModalTitle>{i18n.t('Rename category mapping')}</ModalTitle>
            <ModalContent>
                <Input
                    initialFocus={true}
                    value={mappingName}
                    onChange={(e) => {
                        setMappingName(e.value ?? '')
                    }}
                ></Input>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={closeModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        onClick={() => {
                            onSave(mappingName)
                        }}
                        primary
                    >
                        {i18n.t('Apply')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
const CategoryMappingWrapper = ({
    deleted,
    children,
}: {
    deleted?: boolean
    children: ReactNode
}) => {
    return (
        <div className={deleted ? css.mappingCardDeleted : css.mappingCard}>
            {children}
        </div>
    )
}

type CategoryMappingProps = {
    fieldName: string
    categoryOptionArray: CategoryOption[]
    showSoftDelete: boolean
    onValidationStateChange?: (fieldName: string, isInvalid: boolean) => void
}
export const CategoryMapping = ({
    fieldName,
    categoryOptionArray,
    showSoftDelete = true,
    onValidationStateChange,
}: CategoryMappingProps) => {
    const categoryMapping = useField(fieldName)
    const categoryMappingOnChange = categoryMapping?.input?.onChange
    const categoryMappingValue = categoryMapping?.input?.value
    const categoryOptionInformation = categoryOptionArray.reduce(
        (optionsToName: Record<string, string>, opt) => {
            return { ...optionsToName, [opt.id]: opt.displayName }
        },
        {} as Record<string, string>
    )

    const [nameModalOpen, setNameModalOpen] = useState(false)
    const closeModal = useCallback(() => {
        setNameModalOpen(false)
    }, [setNameModalOpen])
    const saveName = useCallback(
        (newName: string) => {
            categoryMappingOnChange({
                ...categoryMappingValue,
                mappingName: newName,
            })
            closeModal()
        },
        [categoryMappingOnChange, categoryMappingValue, closeModal]
    )
    if (categoryMappingValue.deleted) {
        return (
            <CategoryMappingWrapper deleted>
                <div className={css.deletedMappingText}>
                    {i18n.t(
                        '{{- categoryMappingName}} mapping will be deleted on save',
                        {
                            categoryMappingName:
                                categoryMappingValue.mappingName,
                        }
                    )}
                </div>
                <Button
                    small
                    onClick={() => {
                        categoryMappingOnChange({
                            ...categoryMappingValue,
                            deleted: false,
                        })
                    }}
                >
                    {i18n.t('Undo delete')}
                </Button>
            </CategoryMappingWrapper>
        )
    }

    return (
        <CategoryMappingWrapper>
            {nameModalOpen && (
                <MappingNameModal
                    onSave={saveName}
                    closeModal={closeModal}
                    originalName={categoryMappingValue?.mappingName}
                />
            )}
            <div className={css.mappingHeader}>
                <div className={css.mappingText}>
                    <span>{i18n.t('Mapping: ', { nsSeparator: '~:~' })}</span>
                    <span>{categoryMappingValue?.mappingName}</span>
                </div>

                <ButtonStrip>
                    <Button
                        icon={<IconEdit16 />}
                        small
                        onClick={() => {
                            setNameModalOpen(true)
                        }}
                    ></Button>
                    {showSoftDelete && (
                        <Button
                            icon={<IconDelete16 />}
                            small
                            onClick={() => {
                                categoryMappingOnChange({
                                    ...categoryMappingValue,
                                    deleted: true,
                                })
                            }}
                        ></Button>
                    )}
                </ButtonStrip>
            </div>

            {categoryOptionArray.map((opt: CategoryOption) => (
                <CategoryMappingInput
                    fieldName={fieldName}
                    opt={opt}
                    categoryOptionInformation={categoryOptionInformation}
                />
            ))}
        </CategoryMappingWrapper>
    )
}

const CategoryMappingInput = ({
    fieldName,
    opt,
    categoryOptionInformation,
}) => {
    const { validationError, handleChange, isInvalidExpression } =
        useValidateExpressionField()
    const validation = useField(`${fieldName}.options.${opt.id}.invalid`)
    return (
        <div
            key={`${fieldName}.options.${opt.id}.filter_div`}
            className={css.filterInputContainer}
        >
            <Field
                name={`${fieldName}.options.${opt.id}.filter`}
                key={`${fieldName}.options.${opt.id}.filter`}
            >
                {({ input, meta }) => {
                    return (
                        <>
                            <InputFieldFF
                                label={`${categoryOptionInformation?.[opt.id]}`}
                                input={{
                                    ...input,
                                    onChange: async (value: string) => {
                                        input.onChange(value)
                                        const invalid = await handleChange(
                                            value
                                        )
                                        console.log({ value, invalid })
                                        validation.input.onChange(invalid)
                                    },
                                }}
                                meta={meta}
                                validationText={validationError}
                                warning={isInvalidExpression}
                            />
                        </>
                    )
                }}
            </Field>
        </div>
    )
}
