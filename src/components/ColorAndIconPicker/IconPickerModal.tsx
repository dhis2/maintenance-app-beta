import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CircularLoader,
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SegmentedControl,
} from '@dhis2/ui'
import cx from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebouncedState } from '../../lib'
import { LoadingSpinner } from '../loading/LoadingSpinner'
import classes from './IconPickerModal.module.css'
import { useIconsQuery, Icon } from './useIconsQuery'

type TabName = 'all' | 'positive' | 'negative' | 'outline'

export function IconPickerModal({
    selected,
    onChange,
    onCancel,
}: {
    selected: string
    onChange: ({ icon }: { icon: string }) => void
    onCancel: () => void
}) {
    const {
        liveValue: searchValue,
        setValue: setSearchValue,
        debouncedValue: debouncedSearchValue,
    } = useDebouncedState({
        initialValue: '',
    })
    const [loadingRef, setLoadingRef] = useState<HTMLDivElement | null>(null)
    const [activeTab, setActiveTab] = useState<TabName>('all')

    const [icon, setIcon] = useState(selected)
    const icons = useIconsQuery({
        search: debouncedSearchValue.trim(),
    })

    const fetchNextPage = icons.fetchNextPage

    useEffect(() => {
        if (loadingRef) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        fetchNextPage()
                    }
                },
                {
                    threshold: 1,
                }
            )
            observer.observe(loadingRef)
            return () => {
                observer.disconnect()
            }
        }
    }, [fetchNextPage, loadingRef])

    const displayIcons = useMemo(
        () =>
            activeTab !== 'all'
                ? icons.allData.filter((i) => i.key.endsWith(activeTab))
                : icons.allData,
        [icons.allData, activeTab]
    )

    return (
        <Modal large onClose={onCancel}>
            <ModalTitle>{i18n.t('Choose an icon')}</ModalTitle>

            <ModalContent>
                <div className={classes.tabBar}>
                    <SegmentedControl
                        selected={activeTab}
                        onChange={({ value }) => setActiveTab(value as TabName)}
                        options={[
                            { label: i18n.t('All'), value: 'all' },
                            { label: i18n.t('Positive'), value: 'positive' },
                            { label: i18n.t('Negative'), value: 'negative' },
                            { label: i18n.t('Outline'), value: 'outline' },
                        ]}
                    />

                    <div className={classes.search}>
                        <Input
                            dense
                            placeholder={i18n.t('Search icons')}
                            value={searchValue}
                            onChange={({ value }) =>
                                setSearchValue(value || '')
                            }
                            type="search"
                        />
                    </div>
                </div>

                <div
                    className={classes.iconsContainer}
                    data-test="icons-container"
                >
                    <div className={classes.iconMessage}>
                        {icons.isLoading && <LoadingSpinner />}
                        {icons.isSuccess && displayIcons.length === 0 ? (
                            <div className={classes.emptyIconSearchMessage}>
                                {i18n.t('No icons found')}
                            </div>
                        ) : null}
                    </div>
                    {displayIcons.map(({ key, href }: Icon) => (
                        <div
                            key={key}
                            className={cx(classes.iconContainer, {
                                [classes.active]: key === icon,
                            })}
                            onClick={() => setIcon(key)}
                            title={key}
                        >
                            <img
                                className={classes.iconImage}
                                alt={key}
                                src={href}
                                loading="lazy"
                            />
                        </div>
                    ))}
                    {icons.hasNextPage && !icons.isFetching && (
                        <div
                            className={classes.iconsLoading}
                            ref={(ref) => {
                                if (!!ref && ref !== loadingRef) {
                                    setLoadingRef(ref)
                                }
                            }}
                        >
                            <CircularLoader />
                        </div>
                    )}
                </div>
            </ModalContent>

            <ModalActions>
                <ButtonStrip>
                    <Button
                        primary
                        disabled={!icon}
                        onClick={() => onChange({ icon })}
                    >
                        {i18n.t('Choose icon')}
                    </Button>

                    <Button
                        secondary
                        destructive
                        disabled={!icon}
                        onClick={() => onChange({ icon: '' })}
                    >
                        {i18n.t('Remove icon')}
                    </Button>

                    <Button secondary onClick={onCancel}>
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
