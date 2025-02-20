import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    colors,
    DataTableCell,
    DataTableRow,
    IconEdit24,
    IconTranslate24,
    Input,
    InputEventPayload,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import cx from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import {
    SectionList,
    SectionListPagination,
    SectionListRow,
    SectionListWrapper,
    SelectedColumn,
} from '../../components'
import { LinkButton } from '../../components/LinkButton'
import {
    ActionEdit,
    ActionMore,
    ListActions,
} from '../../components/sectionList/listActions'
import { useModelListView } from '../../components/sectionList/listView'
import css from '../../components/sectionList/SectionList.module.css'
import { SectionListTitle } from '../../components/sectionList/SectionListTitle'
import {
    BaseListModel,
    canEditModel,
    DEFAULT_FIELD_FILTERS,
    SchemaSection,
    TOOLTIPS,
    useParamsForDataQuery,
    useSchemaFromHandle,
} from '../../lib'
import { getFieldFilter } from '../../lib/models/path'
import { Toolbar } from '../../components/sectionList/toolbar'
import {
    SectionListEmpty,
    SectionListError,
} from '../../components/sectionList/SectionListMessages'
import { SectionListLoader } from '../../components/sectionList/SectionListLoader'
import { useSelectedModels } from '../../components/sectionList/useSelectedModels'
import { ModelValue } from '../../components/sectionList/modelValue/ModelValue'
import { TooltipWrapper } from '../../components/tooltip'
import { TranslationDialog } from '../../components/sectionList/translation'
import { CheckBoxOnChangeObject } from '../../types'

export function useSomething(schema) {
    const [editingModel, setEditingModel] = useState(undefined)
    const handleInputChange = (event) => {
        setEditingModel({ ...editingModel, [path]: event.value })
    }

    const renderColumnValueWhenEditing = useCallback(
        (aaa: SelectedColumn, model: BaseListModel) => {
            console.log('*aaaaa', aaa)
            setEditingModel(model)
            if (aaa.path === 'displayName') {
                return (
                    <>
                        <Input
                            value={editingModel && editingModel[aaa.path]}
                            width={'100px'}
                            onChange={handleInputChange}
                        />
                    </>
                )
            }
            return (
                <ModelValue
                    path={aaa.path}
                    schema={schema}
                    sectionModel={model}
                />
            )
        },
        [schema]
    )

    return { editingModel, renderColumnValueWhenEditing }
}
export const Component = () => {
    const { columns } = useModelListView()
    const schema = useSchemaFromHandle()
    const engine = useDataEngine()
    const modelListName = 'filledOrganisationUnitLevels'
    const { selectedModels, checkAllSelected, add, remove, toggle, clearAll } =
        useSelectedModels()
    const initialParams = useParamsForDataQuery()
    const { columns: headerColumns } = useModelListView()
    const [translationDialogModel, setTranslationDialogModel] = useState<
        BaseListModel | undefined
    >(undefined)

    const query = {
        result: {
            resource: modelListName,
            params: {
                ...initialParams,
                filter: initialParams.filter,
                fields: columns
                    .map((column) => getFieldFilter(schema, column.path))
                    .concat(DEFAULT_FIELD_FILTERS),
            },
        },
    }

    const { error, data } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<ModelListResponse>
        },
    })
    const modelList = data?.result
    const [editingModel, setEditingModel] = useState<undefined>(undefined)

    const SectionListMessage = () => {
        if (error) {
            console.log(error.details || error)
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

    const renderColumnValue = useCallback(
        ({
            path,
            model,
            isEditingRow,
        }: {
            path: string
            model: BaseListModel
            isEditingRow: boolean
        }) => {
            if (
                isEditingRow &&
                (path === 'displayName' || path === 'offlineLevels') &&
                editingModel !== undefined
            ) {
                return (
                    <Input
                        value={editingModel[path]}
                        width={'100px'}
                        onChange={(event) =>
                            setEditingModel({
                                ...editingModel,
                                [path]: event.value,
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
        <div>
            <SectionListTitle />
            <div className={css.listDetailsWrapper}>
                <Toolbar
                    selectedModels={selectedModels}
                    onDeselectAll={clearAll}
                />
                editingMOdel {JSON.stringify(editingModel)}
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
                                        isEditingRow:
                                            index === editingModel?.index,
                                    })}
                                </DataTableCell>
                            ))}
                            <DataTableCell>
                                {index === editingModel?.index ? (
                                    <LevelsListSaveEditActions
                                        model={model}
                                        onSaveClick={setEditingModel}
                                    />
                                ) : (
                                    <LevelsListActions
                                        model={model}
                                        schema={schema}
                                        onTranslationClick={
                                            setTranslationDialogModel
                                        }
                                        onEditClick={() =>
                                            setEditingModel({ ...model, index })
                                        }
                                    />
                                )}
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                    <SectionListPagination pager={data?.result.pager} />
                </SectionList>
            </div>
            {translationDialogModel && (
                <TranslationDialog
                    model={translationDialogModel}
                    onClose={() => setTranslationDialogModel(undefined)}
                />
            )}
        </div>
    )
}

const LevelsListActions = ({
    model,
    schema,
    onTranslationClick,
    onEditClick,
}) => {
    const editable = canEditModel(model)

    return (
        <ListActions>
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!editable}
                    secondary
                    aria-label={i18n.t('Edit')}
                    onClick={onEditClick}
                >
                    <IconEdit24 color={colors.grey600} />
                </Button>
            </TooltipWrapper>
            <TooltipWrapper
                condition={!schema.translatable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!schema.translatable}
                    secondary
                    aria-label={i18n.t('Translate')}
                    onClick={onTranslationClick}
                >
                    <IconTranslate24 color={colors.grey600} />
                </Button>
            </TooltipWrapper>
        </ListActions>
    )
}

const LevelsListSaveEditActions = ({ model, onSaveClick }) => {
    const editable = canEditModel(model)

    return (
        <ListActions>
            <TooltipWrapper
                condition={!editable}
                content={TOOLTIPS.noEditAccess}
            >
                <Button
                    small
                    disabled={!editable}
                    secondary
                    aria-label={i18n.t('Save')}
                    onClick={onSaveClick}
                >
                    {i18n.t('Save')}
                </Button>
            </TooltipWrapper>
        </ListActions>
    )
}
