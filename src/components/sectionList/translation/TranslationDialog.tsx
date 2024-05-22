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
import style from './translation.module.css'
import { TranslationForm } from './TranslationForm'
import { useDBLocales, useLastSelectedLocale } from './translationFormHooks'

type TranslationDialogProps = {
    onClose: () => void
    model: BaseListModel
}

export const TranslationDialog = ({
    onClose,
    model,
}: TranslationDialogProps) => {
    const dbLocalesQuery = useDBLocales()
    const dbLocales = dbLocalesQuery.data

    const [selectedLocaleString, setSelectedLocaleString] =
        useLastSelectedLocale()

    const selectedLocale = useMemo(() => {
        if (!selectedLocaleString || !dbLocalesQuery.data) {
            return undefined
        }
        return dbLocalesQuery.data?.find(
            (locale) => locale.locale === selectedLocaleString
        )
    }, [selectedLocaleString, dbLocales])

    return (
        <Modal onClose={onClose} large={true} position="middle">
            <ModalTitle>
                {i18n.t('Translate: {{modelName}}', {
                    modelName: model.displayName,
                })}
            </ModalTitle>
            <Loader queryResponse={dbLocalesQuery}>
                <ModalContent>
                    <div className={style.baseLocale}>
                        <p>{i18n.t('Base locale reference')}</p>
                        <SingleSelectField
                            filterable={true}
                            className={style.SingleSelectField}
                            selected={selectedLocaleString}
                            onChange={({ selected }) =>
                                setSelectedLocaleString(selected)
                            }
                        >
                            {dbLocalesQuery?.data ? (
                                dbLocalesQuery?.data?.map((locale, index) => (
                                    <SingleSelectOption
                                        key={locale.locale}
                                        label={`${locale.displayName} - (${locale.name})`}
                                        value={locale.locale}
                                    />
                                ))
                            ) : (
                                <SingleSelectOption
                                    label="Loading locales..."
                                    value="loading"
                                    disabled
                                />
                            )}
                        </SingleSelectField>
                    </div>

                    <TranslationForm
                        model={model}
                        selectedLocale={selectedLocale && selectedLocale}
                        onClose={onClose}
                    />
                </ModalContent>
            </Loader>
        </Modal>
    )
}
