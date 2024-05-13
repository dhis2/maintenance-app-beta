import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import React from 'react'
import { BaseListModel } from '../../../lib'
import { WebLocale } from '../../../types/generated'
import { TranslationFormContents } from './TranslationForm'

type TranslationDialogProps = {
    onClose: () => void
    model: BaseListModel
}

export const TranslationDialog = ({
    onClose,
    model,
}: TranslationDialogProps) => {
    const [selectedLocale, setSelectedLocale] = React.useState<WebLocale>({
        locale: 'en',
        name: 'English',
        displayName: 'English',
    })

    return (
        <Modal onClose={onClose} large={true} position="middle">
            <ModalTitle>
                {i18n.t('Translate {{modelName}}', {
                    modelName: model.displayName,
                })}
            </ModalTitle>

            <ModalContent>
                <TranslationFormContents
                    model={model}
                    selectedLocale={selectedLocale}
                    setSelectedLocale={setSelectedLocale}
                    onClose={onClose}
                />
                {/**
                 * Selector for locale
                 * FORM
                 * Loop through translatable properties and show input fields
                 *
                 */}
            </ModalContent>
        </Modal>
    )
}
