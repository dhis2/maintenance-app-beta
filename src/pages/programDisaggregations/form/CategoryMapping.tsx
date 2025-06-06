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
import React, { useCallback, useState, ReactNode } from 'react'
import { useField } from 'react-final-form'
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
}
export const CategoryMapping = React.memo(function CategoryMapping({
    fieldName,
    categoryOptionArray,
    showSoftDelete = true,
}: CategoryMappingProps) {
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
                        '{{- categoryMappingName}} mapping will be removed on save',
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
                    {i18n.t('Restore mapping')}
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
                    <span>
                        {i18n.t('Category mapping: ', { nsSeparator: '~:~' })}
                    </span>
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
                    key={opt.id}
                    fieldName={fieldName}
                    opt={opt}
                    categoryOptionInformation={categoryOptionInformation}
                />
            ))}
        </CategoryMappingWrapper>
    )
})

const CategoryMappingInput = ({
    fieldName,
    opt,
    categoryOptionInformation,
}: {
    fieldName: string
    opt: CategoryOption
    categoryOptionInformation: Record<string, string>
}) => {
    const { handleValidateExpression } = useValidateExpressionField()
    const validation = useField(`${fieldName}.options.${opt.id}.invalid`)
    const { input, meta } = useField(
        `${fieldName}.options.${opt.id}.filter`,
        {}
    )
    return (
        <div
            key={`${fieldName}.options.${opt.id}.filter_div`}
            className={css.filterInputContainer}
        >
            <InputFieldFF
                label={`${categoryOptionInformation?.[opt.id]}`}
                input={{
                    ...input,
                    onChange: async (value: string) => {
                        input.onChange(value)
                        const invalid = await handleValidateExpression(value)
                        validation.input.onChange(invalid)
                    },
                }}
                meta={meta}
                validationText={
                    validation.input.value && i18n.t('Invalid expression')
                }
                warning={!!validation.input.value}
            />
        </div>
    )
}
