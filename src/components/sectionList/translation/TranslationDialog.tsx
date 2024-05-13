import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
import { BaseListModel } from '../../../lib'
import {
    TranslationForm,
    TranslationFormFields,
    useDBLocales,
} from './TranslationForm'
import { WebLocale } from '../../../types/generated'
import { Loader } from '../../loading'

type TranslationDialogProps = {
    onClose: () => void
    model: BaseListModel
}

export const TranslationDialog = ({
    onClose,
    model,
}: TranslationDialogProps) => {
    const dbLocalesQuery = useDBLocales()

    const [selectedLocaleString, setSelectedLocaleString] = React.useState<
        string | undefined
    >(undefined)

    const selectedLocale = useMemo(() => {
        if (!selectedLocaleString) {
            return undefined
        }
        return dbLocalesQuery.data?.find(
            (locale) => locale.locale === selectedLocaleString
        )
    }, [selectedLocaleString, dbLocalesQuery.data])

    return (
        <Modal onClose={onClose} large={true} position="middle">
            <ModalTitle>
                {i18n.t('Translate {{modelName}}', {
                    modelName: model.displayName,
                })}
            </ModalTitle>
            <Loader queryResponse={dbLocalesQuery}>
                <ModalContent>
                    <SingleSelect
                        filterable={true}
                        selected={selectedLocaleString}
                        onChange={({ selected }) =>
                            setSelectedLocaleString(selected)
                        }
                    >
                        {dbLocalesQuery.data?.map((locale) => (
                            <SingleSelectOption
                                key={locale.locale}
                                label={locale.displayName}
                                value={locale.locale}
                            />
                        ))}
                    </SingleSelect>
                    {selectedLocale && (
                        <TranslationForm
                            model={model}
                            selectedLocale={selectedLocale}
                        />
                    )}
                    {/**
                     * Selector for locale
                     * FORM
                     * Loop through translatable properties and show input fields
                     *
                     */}
                </ModalContent>
            </Loader>
        </Modal>
    )
}
