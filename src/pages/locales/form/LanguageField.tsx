import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useField } from 'react-final-form'
import { Option, SearchableSingleSelect } from '../../../components'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import classes from './LanguageField.module.css'

type LanguagesResponse = Record<string, string>

export function LanguageField() {
    const queryFn = useBoundResourceQueryFn()
    const {
        input: { value, onChange, onBlur },
        meta: { error, touched },
    } = useField<string | undefined>('language')

    const LANGUAGES_QUERY = {
        resource: 'locales/languages',
    }

    const {
        error: queryError,
        data,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [LANGUAGES_QUERY],
        queryFn: queryFn<LanguagesResponse>,
    })

    const options = useMemo<Option[]>(() => {
        if (!data) {
            return []
        }
        return Object.entries(data).map(([code, name]) => ({
            value: code,
            label: name,
        }))
    }, [data])

    const handleChange = ({ selected }: { selected: string }) => {
        onChange(selected)
        // Manually trigger blur to ensure validation runs
        onBlur()
    }

    return (
        <Field
            name="language"
            label={i18n.t('Language')}
            required
            error={touched && !!error}
            validationText={(touched && error?.toString()) || ''}
        >
            <div className={classes.selectContainer}>
                <SearchableSingleSelect
                    selected={value}
                    invalid={touched && !!error}
                    error={
                        queryError
                            ? i18n.t('Failed to load languages')
                            : undefined
                    }
                    onChange={handleChange}
                    onBlur={onBlur}
                    options={options}
                    loading={isLoading}
                    onRetryClick={refetch}
                    showEndLoader={false}
                    placeholder={i18n.t('Select a language')}
                    clearable
                    clearText={i18n.t('<No value>')}
                    dataTest="locale-language-field"
                />
            </div>
        </Field>
    )
}
