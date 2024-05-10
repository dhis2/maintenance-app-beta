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
import { TranslationFormContents } from './TranslationForm'
import { WebLocale } from '../../../types/generated'

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
        <Modal onClose={onClose} large={true}>
            <ModalTitle>
                {i18n.t('Translate {{modelName}}', {
                    modelName: model.displayName,
                })}
            </ModalTitle>
            <ModalContent>
                <p>Translate Model {model.displayName}</p>
                <TranslationFormContents
                    model={model}
                    selectedLocale={selectedLocale}
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
