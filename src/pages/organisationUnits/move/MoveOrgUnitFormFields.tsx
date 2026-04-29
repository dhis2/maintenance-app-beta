import i18n from '@dhis2/d2-i18n'
import { Field, IconArrowRight24, OrganisationUnitTree } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { useField } from 'react-final-form'
import { useCurrentUserRootOrgUnits } from '../../../lib/user/currentUserStore'
import css from './Move.module.css'

export type OrgUnitTarget = {
    id: string
    displayName: string
    path: string
}

export type SourceOrgUnit = {
    id: string
    displayName: string
    path: string
}

export const MoveOrgUnitFormFields = () => {
    const roots = useCurrentUserRootOrgUnits()
    const rootIds = useMemo(() => roots.map((ou) => ou.id), [roots])
    const rootPaths = useMemo(() => roots.map((ou) => ou.path), [roots])
    const { input: sourceInput, meta: sourceMeta } = useField('sources')
    const { input: targetInput, meta: targetMeta } = useField('target')

    const selectedSourcePaths = useMemo(
        () => sourceInput.value?.map((s: { path: string }) => s.path),
        [sourceInput.value]
    )

    const sourceInitiallyExpanded = useMemo(
        () => [...rootPaths, ...selectedSourcePaths],
        [rootPaths, selectedSourcePaths]
    )

    const [targetExpanded, setTargetExpanded] = useState<string[]>(rootPaths)

    const handleSourceChange = ({
        id,
        displayName,
        path,
        selected,
    }: {
        id: string
        displayName: string
        path: string
        selected: string[]
    }) => {
        const newSources = selected.map((selectedPath) => {
            const existing = sourceInput.value.find(
                (s: { path: string }) => s.path === selectedPath
            )
            return existing ?? { id, path, displayName }
        })
        sourceInput.onChange(newSources)
        sourceInput.onBlur()
    }

    const handleTargetChange = ({
        id,
        displayName,
        path,
    }: {
        id: string
        displayName: string
        path: string
        selected: string[]
    }) => {
        if (targetInput.value?.path === path) {
            targetInput.onChange(undefined)
        } else {
            targetInput.onChange({ id, displayName, path })
        }
        if (!targetExpanded.includes(path)) {
            setTargetExpanded((prev) => [...prev, path])
        }
    }

    return (
        <div className={css.sourceTargetWrapper}>
            <div className={css.treeField}>
                <span className={css.treeFieldLabel}>
                    {i18n.t('Organisation units to move')}
                </span>
                <Field
                    name="source"
                    error={sourceInput.touched && sourceMeta.error}
                    validationText={
                        sourceMeta.touched ? sourceMeta.error : undefined
                    }
                >
                    <div className={css.treeWrapper}>
                        <OrganisationUnitTree
                            key={sourceInitiallyExpanded.join(',')}
                            roots={rootIds}
                            selected={selectedSourcePaths}
                            initiallyExpanded={sourceInitiallyExpanded}
                            onChange={handleSourceChange}
                        />
                    </div>
                </Field>
            </div>

            <IconArrowRight24 />

            <div className={css.treeField}>
                <span className={css.treeFieldLabel}>
                    {i18n.t('Move into')}
                </span>
                <Field
                    name="target"
                    error={targetInput.touched && targetMeta.error}
                    validationText={
                        targetMeta.touched ? targetMeta.error : undefined
                    }
                >
                    <div className={css.treeWrapper}>
                        <OrganisationUnitTree
                            roots={rootIds}
                            singleSelection
                            selected={
                                targetInput.value
                                    ? [targetInput.value.path]
                                    : []
                            }
                            initiallyExpanded={targetExpanded}
                            onChange={handleTargetChange}
                        />
                    </div>
                </Field>
            </div>
        </div>
    )
}
