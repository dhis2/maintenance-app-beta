import i18n from '@dhis2/d2-i18n'
import {
    CheckboxFieldFF,
    RadioFieldFF,
    Field as UIField,
    ModalTitle,
    ModalContent,
} from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import { useModelSectionHandleOrThrow } from '../../../lib'
import css from './DownloadDialog.module.css'
import { useDownloadTotalQuery } from './useDownloadTotalQuery'

type DownloadDialogContentProps = {
    selectedModels: Set<string>
}

export const DownloadDialogContent = ({
    selectedModels,
}: DownloadDialogContentProps) => {
    const section = useModelSectionHandleOrThrow()
    // only used to get total number of selected fields
    const totalQuery = useDownloadTotalQuery({ withFilters: false })
    const totalWithFiltersQuery = useDownloadTotalQuery({ withFilters: true })

    return (
        <>
            <ModalTitle>
                {i18n.t('Download {{section}}', {
                    section: section.titlePlural,
                })}
            </ModalTitle>
            <ModalContent>
                <form className={css.downloadForm}>
                    <UIField
                        label="Compression"
                        className={css.horizontalRadio}
                    >
                        <Field<string | undefined>
                            name="compression"
                            component={RadioFieldFF}
                            label="Zip"
                            type="radio"
                            value={'zip'}
                        />
                        <Field<string | undefined>
                            name="compression"
                            component={RadioFieldFF}
                            value="gz"
                            label="Gzip"
                            type="radio"
                        />
                        <Field<string | undefined>
                            name="compression"
                            component={RadioFieldFF}
                            value="uncompressed"
                            label="Uncompressed"
                            type="radio"
                        />
                    </UIField>
                    <UIField
                        label={i18n.t('{{model}} to include', {
                            model: section.titlePlural,
                        })}
                        className={css.horizontalRadio}
                    >
                        <Field<string | undefined>
                            name="filter"
                            component={RadioFieldFF}
                            label={i18n.t('All ({{number}})', {
                                number: totalQuery.data || 0,
                            })}
                            type="radio"
                            value={'all'}
                        />
                        {selectedModels.size > 0 && (
                            <Field<string | undefined>
                                name="filter"
                                component={RadioFieldFF}
                                label={i18n.t('Only selected ({{number}})', {
                                    number: selectedModels.size,
                                })}
                                type="radio"
                                value={'selected'}
                            />
                        )}
                        <Field<string | undefined>
                            name="filter"
                            label={i18n.t(
                                'Only objects that match selected filters ({{number}})',
                                { number: totalWithFiltersQuery.data || 0 }
                            )}
                            component={RadioFieldFF}
                            value="filters"
                            type="radio"
                        />
                    </UIField>
                    <Field
                        component={CheckboxFieldFF}
                        name="includeSharing"
                        label="Include user sharing settings"
                        type="checkbox"
                    />
                </form>
            </ModalContent>
        </>
    )
}
