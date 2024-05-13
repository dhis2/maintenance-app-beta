import { useDataQuery } from '@dhis2/app-runtime'
import {
    Button,
    ButtonStrip,
    InputFieldFF,
    ReactFinalForm,
    SingleSelectField,
    SingleSelectFieldFF,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useState } from 'react'
import {
    BaseListModel,
    getTranslatedProperty,
    useSchemaFromHandle,
} from '../../../lib'
import { Query, WrapQueryResponse } from '../../../types'
import { WebLocale, Translation } from '../../../types/generated'
import style from './translation.module.css'

export const TranslationForm = () => null

const { Field, Form: RFForm } = ReactFinalForm

type DBLocalesResponse = WrapQueryResponse<WebLocale[]>

const useDBLocales = () => {
    const query = useDataQuery<DBLocalesResponse>({
        result: {
            resource: 'locales/db',
        },
    })

    return {
        ...query,
        data: query.data?.result,
    }
}

const useLocales = (modelId: string) => {
    const schema = useSchemaFromHandle()
    const [query] = useState<Query>(() => ({
        result: {
            resource: `${schema.plural}`,
            id: modelId,
        },
    }))

    const queryResult = useDataQuery<WrapQueryResponse<Translation[]>>(query)

    return {
        ...queryResult,
        data: queryResult.data?.result,
    }
}

const useInitialValues = (model: BaseListModel, selectedLocale: WebLocale) => {
    const { loading, data: locales } = useDBLocales()
    const modelTranslations = useLocales(model.id)
    const relevantModelTranslations = modelTranslations?.data?.filter(
        (translation) => translation.locale === selectedLocale.locale
    )
    return relevantModelTranslations
}

export const TranslationFormContents = ({
    model,
    selectedLocale,
    setSelectedLocale,
    onClose,
}: {
    model: BaseListModel
    selectedLocale: WebLocale
    setSelectedLocale: (selectedLocale: WebLocale) => void
    onClose: () => void
}) => {
    const schema = useSchemaFromHandle()
    console.log(schema, model, 'schema')

    const { loading, data: locales } = useDBLocales()

    const modelTranslations = useLocales(model.id)

    const fields = Object.entries(schema.properties).filter(
        ([fieldName, field]) => field.translatable
    )
    console.log(fields, locales, modelTranslations, 'field')
    const submitForm = (values: any) => {
        console.log('submitted', values)
        // {..values, locale: }
    }

    const handleLocaleChange = ({ selected }: { selected: string }) => {
        console.log('Selected Locale:', selected)
    }
    return (
        <RFForm onSubmit={submitForm}>
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div>
                        <SingleSelectField
                            label="Default label"
                            onChange={handleLocaleChange}
                        >
                            {locales &&
                                locales.map((local) => (
                                    <SingleSelectOption
                                        label={local.name}
                                        value={local.locale}
                                        key={local.locale}
                                    />
                                ))}
                        </SingleSelectField>
                    </div>
                    {fields.map(([fieldName, field]) => (
                        <div key={fieldName} className={style.row}>
                            <Field
                                label={getTranslatedProperty(fieldName)}
                                name={fieldName}
                                component={InputFieldFF}
                            />
                        </div>
                    ))}
                    <ButtonStrip>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button primary type="submit">
                            Save
                        </Button>
                    </ButtonStrip>
                </form>
            )}
        </RFForm>
    )
}
