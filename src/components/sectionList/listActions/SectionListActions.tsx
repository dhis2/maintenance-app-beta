import {
    Button,
    FlyoutMenu,
    IconEdit16,
    IconEdit24,
    IconMore16,
    IconMore24,
    MenuItem,
    Popover,
} from '@dhis2/ui'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import css from './SectionListActions.module.css'

export const ListActions = ({ children }: React.PropsWithChildren) => {
    return <div className={css.listActions}>{children}</div>
}

export const ActionEdit = ({ modelId }: { modelId: string }) => {
    return (
        <Link to={`${modelId}`}>
            <Button small secondary>
                <IconEdit24 />
            </Button>
        </Link>
    )
}

export const ActionMore = () => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    return (
        <div ref={ref}>
            <Button small secondary onClick={() => setOpen(!open)}>
                <IconMore24 />
                {open && (
                    <Popover
                        className={css.actionMorePopover}
                        arrow={false}
                        placement="bottom-end"
                        reference={ref}
                    >
                        <FlyoutMenu>
                            <MenuItem
                                dense
                                label={'Show details'}
                                icon={<IconMore16 />}
                            />
                            <MenuItem
                                dense
                                label={'Edit'}
                                icon={<IconEdit16 />}
                            />
                        </FlyoutMenu>
                    </Popover>
                )}
            </Button>
        </div>
    )
}
