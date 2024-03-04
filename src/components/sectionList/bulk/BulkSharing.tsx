import i18n from '@dhis2/d2-i18n'
import { Button, Divider, Field, SingleSelect } from '@dhis2/ui'
import React, { useState } from 'react'
import { useSchemaFromHandle } from '../../../lib'
import { JsonPatchOperation } from '../../../types'
import {
    SharingSearchSelect,
    MetadataAccessField,
    SharingSearchResult,
} from '../../sharing'
import css from './Bulk.module.css'
import {
    SharingJsonPatchOperation,
    useBulkSharingMutation,
} from './useBulkSharing'

type BulkSharingProps = {
    selectedModels: Set<string>
    children: ({ handleSave }: { handleSave: () => void }) => React.ReactNode
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
    const value = {
        access: access,
        id: sharingEntity.id,
    }

    return {
        op,
        path: `/sharing/${sharingEntity.entity}/${sharingEntity.id}`,
        ...(op === 'remove' ? undefined : { value }),
    }
}

export const BulkSharing = ({ children, selectedModels }: BulkSharingProps) => {
    const schema = useSchemaFromHandle()
    const dataShareable = schema?.dataShareable
    const mutation = useBulkSharingMutation({ modelNamePlural: schema.plural })
    const [sharingActions, setSharingActions] = useState<SharingAction[]>([])

    const handleSave = () => {
        const ids = Array.from(selectedModels)
        const operations = sharingActions.map(actionToJsonPatchOperation)
        mutation(ids, operations)
    }

    return (
        <div className={css.bulkSharingWrapper}>
            <SharingSelection
                dataShareable={dataShareable}
                onAddSharingAction={(action) =>
                    setSharingActions((prev) => [action, ...prev])
                }
            />
            <SharingSummary
                numberOfSelectedModels={selectedModels.size}
                sharingActions={sharingActions}
                onRemoveSharingAction={(action) =>
                    setSharingActions((prev) =>
                        prev.filter((a) => a !== action)
                    )
                }
            />
            {children({ handleSave })}
        </div>
    )
}

type SharingSelectionProps = {
    dataShareable: boolean
    onAddSharingAction: (action: SharingAction) => void
}

const SharingSelection = ({
    dataShareable,
    onAddSharingAction,
}: SharingSelectionProps) => {
    const [selectedSharingEntity, setSelectedSharingEntity] = useState<
        SharingSearchResult | undefined
    >()

    const [metadataAccess, setMetadataAccess] = useState<string>('r-------')
    const [dataAccess, setDataAccess] = useState<string>('--------')

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
            access: metadataAccess,
        } as const

        onAddSharingAction(action)
    }

    return (
        <div>
            <SharingSubTitle>
                {i18n.t('Update sharing for users and groups')}
            </SharingSubTitle>
            <div className={css.selectionWrapper}>
                <Field
                    label={i18n.t('User or group')}
                    className={css.fieldWrapper}
                >
                    <SharingSearchSelect onChange={handleSelectSharingEntity} />
                </Field>
                <Field label={i18n.t('Metadata access')}>
                    <MetadataAccessField
                        value={metadataAccess}
                        onChange={(selected) => setMetadataAccess(selected)}
                    />
                </Field>
                {dataShareable && (
                    <Field label={i18n.t('Data access')}>
                        <SingleSelect
                            dense
                            placeholder={i18n.t('Choose a level')}
                            onChange={() => {}}
                            dataTest="dhis2-uicore-singleselect"
                        />
                    </Field>
                )}
                <Button
                    onClick={handleAddSharingAction}
                    disabled={!selectedSharingEntity}
                >
                    {i18n.t('Add to actions')}
                </Button>
            </div>
        </div>
    )
}

const SharingSummary = ({
    numberOfSelectedModels,
    sharingActions,
    onRemoveSharingAction,
}: {
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
            <div>
                {sharingActions.map((action, index) => (
                    <div key={index}>
                        {action.sharingEntity.name} - {action.access}
                    </div>
                ))}
                <Divider />
            </div>
        </div>
    )
}

const SharingSubTitle = ({ children }: { children: React.ReactNode }) => (
    <span className={css.subtitle}>
        {children}
        <Divider />
    </span>
)
