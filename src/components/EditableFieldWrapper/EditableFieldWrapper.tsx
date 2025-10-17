import { Button } from '@dhis2/ui'
import React, { useState, useEffect, useRef } from 'react'
import classes from './EditableFieldWrapper.module.css'

const MIN_LOADING_DISPLAY_TIME = 500
const FALLBACK_LOADING_TIME = 800

export function EditableFieldWrapper({
    children,
    dataTest,
    onRefresh,
    onAddNew,
    isRefreshing,
}: {
    children: React.ReactNode
    dataTest?: string
    onRefresh: (e: React.MouseEvent<HTMLButtonElement>) => void
    onAddNew: (e: React.MouseEvent<HTMLButtonElement>) => void
    isRefreshing?: boolean
}) {
    const [internalLoading, setInternalLoading] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const loadingStartTime = useRef<number | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const isLoading = isRefreshing ?? internalLoading

    useEffect(() => {
        if (isLoading && !showLoading) {
            loadingStartTime.current = Date.now()
            setShowLoading(true)
            return
        }

        if (!isLoading && showLoading) {
            const elapsed = Date.now() - (loadingStartTime.current ?? 0)
            const remainingTime = Math.max(
                0,
                MIN_LOADING_DISPLAY_TIME - elapsed
            )

            timeoutRef.current = setTimeout(() => {
                setShowLoading(false)
                loadingStartTime.current = null
            }, remainingTime)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [isLoading, showLoading])

    const handleRefresh = (
        _: unknown,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        onRefresh(e)

        if (isRefreshing === undefined) {
            setInternalLoading(true)
            setTimeout(() => setInternalLoading(false), FALLBACK_LOADING_TIME)
        }
    }

    return (
        <div data-test={dataTest} className={classes.editableFieldWrapper}>
            <div>{children}</div>

            <div className={classes.actions}>
                <Button
                    small
                    loading={showLoading}
                    disabled={showLoading}
                    onClick={handleRefresh}
                >
                    Refresh
                </Button>
                <Button small onClick={(_, e) => onAddNew(e)}>
                    Add new
                </Button>
            </div>
        </div>
    )
}
