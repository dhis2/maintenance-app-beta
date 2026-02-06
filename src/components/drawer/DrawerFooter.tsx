import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React from 'react'
import css from './DrawerFooter.module.css'

export interface DrawerFooterAction {
    label: string
    onClick: () => void
    primary?: boolean
    secondary?: boolean
    disabled?: boolean
    loading?: boolean
}

export interface DrawerFooterProps {
    actions: DrawerFooterAction[]
    infoMessage?: string
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
    actions,
    infoMessage,
}) => {
    return (
        <div className={css.drawerFooter}>
            <ButtonStrip>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        primary={action.primary}
                        secondary={action.secondary}
                        small
                        onClick={action.onClick}
                        disabled={action.disabled}
                        loading={action.loading}
                    >
                        {action.label}
                    </Button>
                ))}
            </ButtonStrip>
            {infoMessage && (
                <div className={css.actionsInfo}>
                    <IconInfo16 />
                    <p>{infoMessage}</p>
                </div>
            )}
        </div>
    )
}
