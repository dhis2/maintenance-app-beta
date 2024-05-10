import { useDataQuery } from '@dhis2/app-runtime'
import React, { useState } from 'react'
import {
    BaseListModel,
    getTranslatedProperty,
    useSchemaFromHandle,
} from '../../../lib'
import { Query, WrapQueryResponse } from '../../../types'
import { WebLocale, Translation } from '../../../types/generated'
export const TranslationForm = () => null

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

    //
}

export const TranslationFormContents = ({
    model,
    selectedLocale,
}: {
    model: BaseListModel
    selectedLocale: WebLocale
}) => {
    const schema = useSchemaFromHandle()

    const { loading, data: locales } = useDBLocales()

    const modelTranslations = useLocales(model.id)
    const fields = Object.entries(schema.properties).filter(
        ([fieldName, field]) => field.translatable
    )
    console.log({ fields })

    return fields.map(([fieldName, field]) => (
        <div key={fieldName}>
            <label>{getTranslatedProperty(fieldName)}</label>
            <input type="text" />
        </div>
    ))
}
