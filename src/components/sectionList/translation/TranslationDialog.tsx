import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalContent,
    ModalTitle,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useMemo } from 'react'
import { BaseListModel } from '../../../lib'
import { Loader } from '../../loading'
import style from './translation.module.css'
import { TranslationForm } from './TranslationForm'
import { useLastSelectedLocale, useDBLocales } from './translationFormHooks'

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
        if (!selectedLocaleString || !dbLocales) {
            return undefined
        }
        return dbLocales.find(
            (locale) => locale.locale === selectedLocaleString
        )
    }, [selectedLocaleString, dbLocales])

    return (
        <Modal
            onClose={onClose}
            large={true}
            position="middle"
            dataTest="translation-dialog"
        >
            <ModalTitle>
                {i18n.t('Translate: {{modelName}}', {
                    modelName: model.displayName,
                    nsSeparator: `:::`,
                    interpolation: {
                        escapeValue: false,
                    },
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
                            dataTest="translation-dialog-locale-select"
                        >
                            {dbLocalesQuery.data?.map((locale) => (
                                <SingleSelectOption
                                    key={locale.locale}
                                    label={`${locale.displayName} - (${locale.name})`}
                                    value={locale.locale}
                                />
                            ))}
                        </SingleSelectField>
                    </div>

                    <TranslationForm
                        model={model}
                        selectedLocale={selectedLocale}
                        onClose={onClose}
                    />
                </ModalContent>
            </Loader>
        </Modal>
    )
}
