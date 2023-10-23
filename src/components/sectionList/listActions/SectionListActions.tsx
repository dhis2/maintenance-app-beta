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
import {
    Link,
    useHref,
    useLinkClickHandler,
    useNavigate,
    useNavigation,
} from 'react-router-dom'
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

type ActionMoreProps = {
    modelId: string
    onShowDetailsClick: () => void
}
export const ActionMore = ({
    modelId,
    onShowDetailsClick,
}: ActionMoreProps) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const href = useHref(modelId, { relative: 'path' })
    const handleClick = useLinkClickHandler(modelId)
    const navigate = useNavigate()
    return (
        <div ref={ref}>
            <Button
                small
                secondary
                onClick={() => setOpen(!open)}
                icon={<IconMore24 />}
            ></Button>
            {open && (
                <Popover
                    className={css.actionMorePopover}
                    arrow={false}
                    placement="bottom-end"
                    reference={ref}
                    onClickOutside={() => setOpen(false)}
                >
                    <FlyoutMenu>
                        <MenuItem
                            dense
                            label={'Show details'}
                            icon={<IconMore16 />}
                            onClick={onShowDetailsClick}
                        />
                        <MenuItem
                            dense
                            label={'Edit'}
                            icon={<IconEdit16 />}
                            onClick={(_, e) => {
                                handleClick(e)
                                setOpen(false)
                            }}
                            target="_blank"
                            href={href}
                        ></MenuItem>
                    </FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}
