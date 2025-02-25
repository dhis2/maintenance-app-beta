import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    DataTableCell,
    DataTableRow,
    Input,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { SectionList } from '../../components'
import { useModelListView } from '../../components/sectionList/listView'
import { ModelValue } from '../../components/sectionList/modelValue/ModelValue'
import css from '../../components/sectionList/SectionList.module.css'
import { SectionListLoader } from '../../components/sectionList/SectionListLoader'
import {
    SectionListEmpty,
    SectionListError,
} from '../../components/sectionList/SectionListMessages'
import {
    BaseListModel,
    DEFAULT_FIELD_FILTERS,
    getViewConfigForSection,
    SECTIONS_MAP,
    useSchemaFromHandle,
} from '../../lib'
import { useOnEditCompletedSuccessfully } from '../../lib/form/useOnSubmit'
import { getFieldFilter } from '../../lib/models/path'
import { Access } from '../../types/generated'
import { EditingListActions } from './EditingListActions'
import { ViewingListActions } from './ViewingListActions'

export type OrgUnitListModel = {
    id: string
    name: string
    access: Access
    displayName: string
    offlineLevels?: number
    index?: number
}
type ModelListResponse = { result: OrgUnitListModel[] }

export const ListRows = ({
    onTranslationClick,
}: {
    onTranslationClick: (model: OrgUnitListModel) => void
}) => {
    const schema = useSchemaFromHandle()
    const { columns: headerColumns } = useModelListView()
    const dataEngine = useDataEngine()
    const onEditCompletedSuccessfully = useOnEditCompletedSuccessfully(
        SECTIONS_MAP.organisationUnitLevel
    )
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const [editingModel, setEditingModel] = useState<
        undefined | OrgUnitListModel
    >(undefined)

    const query = {
        result: {
            resource: 'filledOrganisationUnitLevels',
            params: {
                order: 'level',
                fields: getViewConfigForSection(schema.name)
                    .columns.available.map((column) =>
                        getFieldFilter(schema, column.path)
                    )
                    .concat(DEFAULT_FIELD_FILTERS)
                    .concat(['name']),
            },
        },
    }

    const { error, data, refetch } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return dataEngine.query(query, {
                signal,
            }) as Promise<ModelListResponse>
        },
    })
    const modelList = data?.result

    const SectionListMessage = () => {
        if (error) {
            console.log(error)
            return <SectionListError />
        }
        if (!modelList) {
            return <SectionListLoader />
        }
        if (modelList.length < 1) {
            return <SectionListEmpty />
        }
        return null
    }

    const saveNewOrgLevels = async () => {
        if (modelList && editingModel) {
            const newLevels = modelList.map((level, index) =>
                index === editingModel.index ? editingModel : level
            )
            const mutation = {
                resource: 'filledOrganisationUnitLevels',
                type: 'create',
                data: { organisationUnitLevels: newLevels },
            } as const
            try {
                await dataEngine.mutate(mutation)
                onEditCompletedSuccessfully({
                    withChanges:
                        !!editingModel.index &&
                        (editingModel.displayName !==
                            modelList[editingModel.index].displayName ||
                            editingModel.offlineLevels !==
                                modelList[editingModel.index].offlineLevels),
                })
                setEditingModel(undefined)
                refetch()
            } catch {
                saveAlert.show({
                    message: i18n.t('Error saving organisation unit levels'),
                    error: true,
                })
            }
        }
    }

    const renderColumnValue = useCallback(
        (props: {
            path: string
            model: BaseListModel
            isEditingRow: boolean
        }) => {
            const { path, model, isEditingRow } = props
            if (
                isEditingRow &&
                path === 'offlineLevels' &&
                editingModel !== undefined
            ) {
                return (
                    <SingleSelect
                        dense
                        selected={editingModel.offlineLevels?.toString() || ''}
                        onChange={({ selected }) => {
                            setEditingModel({
                                ...editingModel,
                                offlineLevels:
                                    selected === ''
                                        ? undefined
                                        : parseInt(selected),
                            })
                        }}
                    >
                        <SingleSelectOption
                            key={`offlineLevel-none`}
                            value={''}
                            label={i18n.t('Default')}
                        />
                        {Array.from({ length: 15 }, (_, i) => i + 1).map(
                            (level) => (
                                <SingleSelectOption
                                    key={`offlineLevel-${level}`}
                                    value={level.toString()}
                                    label={level.toString()}
                                />
                            )
                        )}
                    </SingleSelect>
                )
            }
            if (
                isEditingRow &&
                path === 'displayName' &&
                editingModel !== undefined
            ) {
                return (
                    <Input
                        value={editingModel.name || ''}
                        width={'100px'}
                        onChange={(event) =>
                            setEditingModel({
                                ...editingModel,
                                ['name']: event.value || '',
                            })
                        }
                    />
                )
            }
            return (
                <ModelValue path={path} schema={schema} sectionModel={model} />
            )
        },
        [schema, editingModel]
    )

    return (
        <SectionList
            headerColumns={headerColumns.map((column) => ({
                ...column,
                disableSorting: true,
            }))}
        >
            <SectionListMessage />
            {modelList?.map((model, index) => (
                <DataTableRow
                    className={css.listRow}
                    dataTest={`section-list-row-${model.id}`}
                    key={model.id}
                >
                    <DataTableCell width="48px" />
                    {headerColumns.map((selectedColumn) => (
                        <DataTableCell key={selectedColumn.path}>
                            {renderColumnValue({
                                path: selectedColumn.path,
                                model,
                                isEditingRow: index === editingModel?.index,
                            })}
                        </DataTableCell>
                    ))}
                    <DataTableCell>
                        {index === editingModel?.index ? (
                            <EditingListActions
                                model={model}
                                onSaveClick={saveNewOrgLevels}
                                onCancelClick={() => setEditingModel(undefined)}
                            />
                        ) : (
                            <ViewingListActions
                                model={model}
                                schema={schema}
                                onTranslationClick={() =>
                                    onTranslationClick(model)
                                }
                                onEditClick={() =>
                                    setEditingModel({ ...model, index })
                                }
                            />
                        )}
                    </DataTableCell>
                </DataTableRow>
            ))}
        </SectionList>
    )
}
