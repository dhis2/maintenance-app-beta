import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Divider, Field, NoticeBox } from '@dhis2/ui'
import React, { FormEvent, useState } from 'react'
import { useSchemaFromHandle } from '../../../lib'
import {
    SharingSearchSelect,
    MetadataAccessField,
    SharingSearchResult,
    DataAccessField,
} from '../../sharing'
import css from './Bulk.module.css'
import { ActionSummary } from './BulkActionSummary'
import {
    SharingJsonPatchOperation,
    useBulkSharingMutation,
} from './useBulkSharing'

type BulkSharingProps = {
    selectedModels: Set<string>
    onSaved: () => void
    children: ({
        submitting,
        disableSave,
    }: {
        submitting: boolean
        disableSave: boolean
    }) => React.ReactNode
}

export type SharingAction = {
    op: 'remove' | 'replace'
    sharingEntity: SharingSearchResult
    access: string
}

const actionToJsonPatchOperation = (
    action: SharingAction
): SharingJsonPatchOperation => {
    const { op, sharingEntity, access } = action
    const value =
        sharingEntity.id === 'public'
            ? access
            : {
                  access: access,
                  id: sharingEntity.id,
              }

    return {
        op,
        path:
            sharingEntity.id === 'public'
                ? `/sharing/public`
                : `/sharing/${sharingEntity.entity}/${sharingEntity.id}`,
        ...(op === 'remove' ? undefined : { value }),
    }
}

/*
   Usage of React-Final-Form does not seem necessary because we're not using
   validation or initialState. And the result of the form (list of added SharingActions) are not kept in form-state.
   However, we still need some metastate for the form.
   */
type FormMetaState = {
    submitting: boolean
    error: undefined | string
}

export const BulkSharing = ({
    children,
    selectedModels,
    onSaved,
}: BulkSharingProps) => {
    const schema = useSchemaFromHandle()
    const dataShareable = schema.dataShareable
    const mutation = useBulkSharingMutation({ modelNamePlural: schema.plural })

    const [sharingActions, setSharingActions] = useState<SharingAction[]>([])
    const [metaState, setMetaState] = useState<FormMetaState>({
        submitting: false,
        error: undefined,
    })

    const { show: showSuccessAlert } = useAlert(
        i18n.t('Successfully updated sharing for {{number}} items', {
            number: selectedModels.size,
        }),
        { success: true }
    )

    const handleSave = async (e: FormEvent) => {
        e.preventDefault()
        const ids = Array.from(selectedModels)
        const operations = sharingActions.map(actionToJsonPatchOperation)
        setMetaState({ submitting: true, error: undefined })
        try {
            await mutation(ids, operations)
            setMetaState({ submitting: false, error: undefined })
            showSuccessAlert()
            onSaved()
        } catch (e) {
            console.error(e)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = e as any
            if ('message' in error) {
                setMetaState({ submitting: false, error: error.message })
            } else {
                setMetaState({
                    submitting: false,
                    error: i18n.t('An unknown error occurred'),
                })
            }
        }
    }

    const handleAddSharingAction = (action: SharingAction) => {
        setSharingActions((prev) => {
            const actionExists = sharingActions.some(
                (a) => a.sharingEntity.id === action.sharingEntity.id
            )
            if (actionExists) {
                // if the user/group already exists, update with new action
                return sharingActions.map((a) =>
                    a.sharingEntity.id === action.sharingEntity.id ? action : a
                )
            }
            return action.sharingEntity.id === 'public'
                ? [...prev, action]
                : [action, ...prev]
        })
    }

    return (
        <form className={css.bulkSharingWrapper} onSubmit={handleSave}>
            <SharingSelection
                dataShareable={dataShareable}
                onAddSharingAction={handleAddSharingAction}
            />
            <SharingSelection
                dataShareable={dataShareable}
                onAddSharingAction={handleAddSharingAction}
                publicSharing={true}
            />
            <SharingSummary
                numberOfSelectedModels={selectedModels.size}
                sharingActions={sharingActions}
                dataShareable={dataShareable}
                onRemoveSharingAction={(action) =>
                    setSharingActions((prev) =>
                        prev.filter((a) => a !== action)
                    )
                }
            />
            {metaState.error && (
                <NoticeBox
                    error={true}
                    title={i18n.t('Failed to update sharing')}
                >
                    {metaState.error}
                </NoticeBox>
            )}

            {children({
                submitting: metaState.submitting,
                disableSave: sharingActions.length < 1,
            })}
        </form>
    )
}

type SharingSelectionProps = {
    dataShareable: boolean
    onAddSharingAction: (action: SharingAction) => void
    publicSharing?: boolean
}

const SharingSelection = ({
    dataShareable,
    onAddSharingAction,
    publicSharing = false,
}: SharingSelectionProps) => {
    const [selectedSharingEntity, setSelectedSharingEntity] = useState<
        SharingSearchResult | undefined
    >()

    const [accessString, setAccessString] = useState<string>('r-------')

    const handleSelectSharingEntity = (selected: SharingSearchResult) => {
        setSelectedSharingEntity(selected)
    }

    const handleAddSharingAction = () => {
        if (!selectedSharingEntity) {
            return
        }
        const action = {
            op: 'replace',
            sharingEntity: selectedSharingEntity,
            access: accessString,
        } as const

        onAddSharingAction(action)
    }

    const handleAddPublicSharingAction = () => {
        const action = {
            op: 'replace',
            access: accessString,
            sharingEntity: {
                displayName: 'public',
                id: 'public',
                entity: 'public',
            },
        } as const
        onAddSharingAction(action)
    }

    return (
        <div>
            <SharingSubTitle>
                {publicSharing
                    ? i18n.t('Update public sharing')
                    : i18n.t('Update sharing for users and groups')}
            </SharingSubTitle>
            <div className={css.selectionWrapper}>
                <Field
                    label={
                        publicSharing
                            ? i18n.t('Public sharing')
                            : i18n.t('User or group')
                    }
                    className={css.sharingEntitySelect}
                >
                    {!publicSharing && (
                        <SharingSearchSelect
                            onChange={handleSelectSharingEntity}
                        />
                    )}
                </Field>
                <Field
                    className={css.accessField}
                    label={i18n.t('Metadata access')}
                >
                    <MetadataAccessField
                        value={accessString}
                        onChange={(selected) => setAccessString(selected)}
                    />
                </Field>
                {dataShareable && (
                    <Field
                        className={css.accessField}
                        label={i18n.t('Data access')}
                    >
                        <DataAccessField
                            value={accessString}
                            onChange={(selected) => setAccessString(selected)}
                        />
                    </Field>
                )}
                <Button
                    className={css.addActionButton}
                    onClick={
                        publicSharing
                            ? handleAddPublicSharingAction
                            : handleAddSharingAction
                    }
                    disabled={!publicSharing && !selectedSharingEntity}
                    dataTest="add-to-sharing-actions-button"
                >
                    {i18n.t('Add to actions')}
                </Button>
            </div>
        </div>
    )
}

const SharingSummary = ({
    dataShareable,
    numberOfSelectedModels,
    sharingActions,
    onRemoveSharingAction,
}: {
    dataShareable: boolean
    numberOfSelectedModels: number
    sharingActions: SharingAction[]
    onRemoveSharingAction: (action: SharingAction) => void
}) => {
    return (
        <div>
            <SharingSubTitle>
                {i18n.t('Access to be updated for {{number}} items', {
                    number: numberOfSelectedModels,
                })}{' '}
            </SharingSubTitle>
            {sharingActions.map((action) => (
                <ActionSummary
                    key={action.sharingEntity.id}
                    action={action}
                    dataShareable={dataShareable}
                    onRemove={() => onRemoveSharingAction(action)}
                />
            ))}
        </div>
    )
}

const SharingSubTitle = ({ children }: { children: React.ReactNode }) => (
    <span className={css.subtitle}>
        {children}
        <Divider />
    </span>
)
