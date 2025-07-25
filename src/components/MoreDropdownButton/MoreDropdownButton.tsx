import {
    Button,
    ButtonProps,
    Divider,
    DividerProps,
    IconMore24,
    MenuItem,
    MenuItemProps,
    Popover,
    colors,
} from '@dhis2/ui'
import React, { useMemo, useRef, useState } from 'react'
import css from './MoreDropdownButton.module.css'

export type MoreDropdownButtonProps = React.PropsWithChildren

const DropdownContext = React.createContext<{ close: () => void } | null>(null)

const useDropdownMenu = () => {
    const context = React.useContext(DropdownContext)
    if (!context) {
        throw new Error('useDropdown must be used within a MoreDropdownButton')
    }
    return context
}

export const MoreDropdownButton = ({ children }: MoreDropdownButtonProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const contextValue = useMemo(
        () => ({ close: () => setOpen(false) }),
        [setOpen]
    )

    return (
        <DropdownContext.Provider value={contextValue}>
            <div ref={ref}>
                <MoreDropdownTrigger
                    onClick={(p, e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpen(!open)
                    }}
                />
                {open && (
                    <Popover
                        arrow={false}
                        placement="bottom-end"
                        reference={ref}
                        onClickOutside={(p, e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            contextValue.close()
                        }}
                        dataTest="dropdown-button-more-popover"
                    >
                        {children}
                    </Popover>
                )}
            </div>
        </DropdownContext.Provider>
    )
}

export const MoreDropdownTrigger = (props: ButtonProps) => (
    <Button
        small
        secondary
        dataTest="dropdown-button-more-trigger"
        icon={<IconMore24 color={colors.grey600} />}
        {...props}
    />
)

export const MoreDropdownItem = ({ onClick, ...props }: MenuItemProps) => {
    const { close } = useDropdownMenu()

    const handleClick: MenuItemProps['onClick'] = (payload, event) => {
        onClick?.(payload, event)
        close()
    }

    return <MenuItem {...props} onClick={handleClick} />
}

export const MoreDropdownDivider = (props: DividerProps) => (
    <Divider className={css.divider} dense {...props} />
)
