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
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
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
    const [editingOrgUnitLevel, setEditingOrgUnitLevel] = useState<
        undefined | OrgUnitListModel
    >(undefined)

    const queryFn = useBoundResourceQueryFn()
    const { error, data, refetch } = useQuery({
        queryKey: [
            {
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
        ],
        queryFn: queryFn<OrgUnitListModel[]>,
    })

    const SectionListMessage = () => {
        if (error) {
            console.log(error)
            return <SectionListError />
        }
        if (!data) {
            return <SectionListLoader />
        }
        if (data.length < 1) {
            return <SectionListEmpty />
        }
        return null
    }

    const saveNewOrgLevels = async () => {
        if (data && editingOrgUnitLevel) {
            const { index, ...newLevel } = editingOrgUnitLevel
            const newLevels = data.map((level, index) =>
                index === editingOrgUnitLevel.index ? newLevel : level
            )
            const levelsHaveChanged =
                editingOrgUnitLevel.index !== undefined &&
                (editingOrgUnitLevel.name !==
                    data[editingOrgUnitLevel.index].name ||
                    editingOrgUnitLevel.offlineLevels !==
                        data[editingOrgUnitLevel.index].offlineLevels)
            const mutation = {
                resource: 'filledOrganisationUnitLevels',
                type: 'create',
                data: { organisationUnitLevels: newLevels },
            } as const
            try {
                if (levelsHaveChanged) {
                    await dataEngine.mutate(mutation)
                }
                onEditCompletedSuccessfully({ withChanges: levelsHaveChanged })
                setEditingOrgUnitLevel(undefined)
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
            editingOrgUnitLevel?: OrgUnitListModel
        }) => {
            const { path, model, editingOrgUnitLevel } = props
            if (path === 'offlineLevels' && editingOrgUnitLevel !== undefined) {
                return (
                    <SingleSelect
                        dense
                        selected={
                            editingOrgUnitLevel.offlineLevels?.toString() || ''
                        }
                        onChange={({ selected }) => {
                            setEditingOrgUnitLevel({
                                ...editingOrgUnitLevel,
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
            if (path === 'displayName' && editingOrgUnitLevel !== undefined) {
                return (
                    <Input
                        dense
                        value={editingOrgUnitLevel.name || ''}
                        width={'150px'}
                        onChange={(event) =>
                            setEditingOrgUnitLevel({
                                ...editingOrgUnitLevel,
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
        [schema]
    )

    return (
        <SectionList
            headerColumns={headerColumns.map((column) => ({
                ...column,
                disableSorting: true,
            }))}
        >
            <SectionListMessage />
            {data?.map((model, index) => (
                <DataTableRow
                    className={css.listRow}
                    dataTest={`section-list-row`}
                    key={model.id}
                >
                    <DataTableCell width="48px" />
                    {headerColumns.map((selectedColumn) => (
                        <DataTableCell key={selectedColumn.path}>
                            {renderColumnValue({
                                path: selectedColumn.path,
                                model,
                                editingOrgUnitLevel:
                                    index === editingOrgUnitLevel?.index
                                        ? editingOrgUnitLevel
                                        : undefined,
                            })}
                        </DataTableCell>
                    ))}
                    <DataTableCell width="150px">
                        {index === editingOrgUnitLevel?.index ? (
                            <EditingListActions
                                model={model}
                                onSaveClick={saveNewOrgLevels}
                                onCancelClick={() =>
                                    setEditingOrgUnitLevel(undefined)
                                }
                            />
                        ) : (
                            <ViewingListActions
                                model={model}
                                schema={schema}
                                onTranslationClick={() =>
                                    onTranslationClick(model)
                                }
                                onEditClick={() =>
                                    setEditingOrgUnitLevel({ ...model, index })
                                }
                            />
                        )}
                    </DataTableCell>
                </DataTableRow>
            ))}
        </SectionList>
    )
}
