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
import { useFilterQueryParams } from '../../../lib'
import { ModelSection } from '../../../types'
import { TooltipWrapper } from '../../tooltip'
import css from './DownloadDialog.module.css'
import { useDownloadTotalQuery } from './useDownloadTotalQuery'

type DownloadDialogContentProps = {
    selectedModels: Set<string>
    section: ModelSection
}

export const DownloadDialogContent = ({
    selectedModels,
    section,
}: DownloadDialogContentProps) => {
    // only used to get total number of selected fields
    const filterParams = useFilterQueryParams()
    const totalQuery = useDownloadTotalQuery({
        modelNamePlural: section.namePlural,
    })

    const hasFilters = filterParams.length > 0
    const hasSelected = selectedModels.size > 0

    const totalWithFiltersQuery = useDownloadTotalQuery({
        modelNamePlural: section.namePlural,
        filters: filterParams,
        enabled: hasFilters, // no reason to send this request if no filters
    })

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
                            label={i18n.t('Uncompressed')}
                            type="radio"
                        />
                    </UIField>
                    <UIField
                        label={i18n.t('{{model}} to include', {
                            model: section.titlePlural,
                        })}
                        className={css.horizontalRadio}
                        dataTest="download-models-to-include"
                    >
                        <Field<string | undefined>
                            name="filterType"
                            component={RadioFieldFF}
                            label={
                                totalQuery.data
                                    ? i18n.t('All ({{number}})', {
                                          number: totalQuery.data,
                                      })
                                    : i18n.t('All')
                            }
                            type="radio"
                            value={'all'}
                        />
                        <TooltipWrapper
                            condition={!hasSelected}
                            content={i18n.t('No items selected')}
                        >
                            <Field<string | undefined>
                                name="filterType"
                                component={RadioFieldFF}
                                label={
                                    hasSelected
                                        ? i18n.t('Only selected ({{number}})', {
                                              number: selectedModels.size,
                                          })
                                        : i18n.t('Only selected')
                                }
                                type="radio"
                                value={'selected'}
                                disabled={!hasSelected}
                            />
                        </TooltipWrapper>
                        <TooltipWrapper
                            condition={!hasFilters}
                            content={i18n.t('No filters applied')}
                        >
                            <Field<string | undefined>
                                name="filterType"
                                label={
                                    totalWithFiltersQuery.data
                                        ? i18n.t(
                                              'Only items that match selected filters ({{number}})',
                                              {
                                                  number: totalWithFiltersQuery.data,
                                              }
                                          )
                                        : i18n.t(
                                              'Only items that match selected filters'
                                          )
                                }
                                component={RadioFieldFF}
                                value="filters"
                                type="radio"
                                disabled={!hasFilters}
                            />
                        </TooltipWrapper>
                    </UIField>
                    <Field
                        component={CheckboxFieldFF}
                        name="includeSharing"
                        label={i18n.t('Include user sharing settings')}
                        type="checkbox"
                    />
                </form>
            </ModalContent>
        </>
    )
}
