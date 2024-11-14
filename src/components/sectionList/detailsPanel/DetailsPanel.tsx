import i18n from '@dhis2/d2-i18n'
import { Card, IconCross24, Button, ButtonStrip, NoticeBox } from '@dhis2/ui'
import React, { PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router-dom'
import { TOOLTIPS } from '../../../lib'
import { LinkButton } from '../../LinkButton'
import { TooltipWrapper } from '../../tooltip'
import css from './DetailsPanel.module.css'

type DetailsPanelProps = {
    children: React.ReactNode
    onClose: () => void
}

export const DetailsPanel = ({ children, onClose }: DetailsPanelProps) => {
    return (
        <aside className={css.detailsPanel}>
            <Card className={css.detailsPanelCard} dataTest="details-panel">
                <div className={css.detailsPanelWrapper}>
                    <DetailsPanelHeader onClose={onClose} />
                    <ErrorBoundary FallbackComponent={DetailsPanelError}>
                        {children}
                    </ErrorBoundary>
                </div>
            </Card>
        </aside>
    )
}

type DetailsContentProps = {
    children: React.ReactNode
    displayName: string
}

export const DetailsPanelContent = ({
    children,
    displayName,
}: DetailsContentProps) => {
    return (
        <div>
            <div className={css.detailsPanelTitle}>{displayName}</div>
            {children}
        </div>
    )
}

export const DetailsPanelButtons = ({
    modelId,
    editable,
}: {
    modelId: string
    editable?: boolean
}) => (
    <ButtonStrip>
        <TooltipWrapper condition={!editable} content={TOOLTIPS.noEditAccess}>
            <LinkButton small secondary to={modelId} disabled={!editable}>
                {i18n.t('Edit')}
            </LinkButton>
        </TooltipWrapper>
    </ButtonStrip>
)

const DetailsPanelHeader = ({ onClose }: { onClose: () => void }) => (
    <header className={css.detailsPanelHeader}>
        <span className={css.detailsPanelHeaderTitle}>{i18n.t('Details')}</span>
        <button className={css.detailsPanelCloseButton} onClick={onClose}>
            <IconCross24 />
        </button>
    </header>
)

export const DetailsList = ({ children }: PropsWithChildren) => (
    <div className={css.detailsList}>{children}</div>
)

const DetailsPanelError = () => {
    return (
        <NoticeBox title={i18n.t('An error occurred')} error>
            {i18n.t('Failed to load details')}
        </NoticeBox>
    )
}
