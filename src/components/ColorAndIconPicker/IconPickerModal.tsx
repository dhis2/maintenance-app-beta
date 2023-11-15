import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Tab,
    TabBar,
} from '@dhis2/ui'
import cx from 'classnames'
import React, { useState } from 'react'
import { filterIcons } from './filterIcons'
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
    const [searchValue, setSearchValue] = useState('')
    const [activeTab, setActiveTab] = useState<TabName>('all')
    const [icon, setIcon] = useState(selected)
    const icons = useIconsQuery()
    const displayIcons = searchValue
        ? filterIcons(icons.data[activeTab], searchValue)
        : icons.data[activeTab]

    return (
        <Modal large onClose={onCancel}>
            <ModalTitle>Select icon</ModalTitle>

            <ModalContent>
                <div className={classes.tabBar}>
                    <TabBar>
                        <Tab
                            onClick={() => setActiveTab('all')}
                            selected={activeTab === 'all'}
                        >
                            All
                        </Tab>

                        <Tab
                            onClick={() => setActiveTab('positive')}
                            selected={activeTab === 'positive'}
                        >
                            Positive
                        </Tab>

                        <Tab
                            onClick={() => setActiveTab('negative')}
                            selected={activeTab === 'negative'}
                        >
                            Negative
                        </Tab>

                        <Tab
                            onClick={() => setActiveTab('outline')}
                            selected={activeTab === 'outline'}
                        >
                            Outline
                        </Tab>
                    </TabBar>

                    <div className={classes.search}>
                        <Input
                            dense
                            placeholder={i18n.t('Search icons')}
                            value={searchValue}
                            onChange={({ value }: { value: string }) =>
                                setSearchValue(value)
                            }
                        />
                    </div>
                </div>

                <div className={classes.iconsContainer}>
                    {displayIcons.map(({ key, description, href }: Icon) => (
                        <div
                            key={key}
                            className={cx(classes.iconContainer, {
                                [classes.active]: key === icon,
                            })}
                            onClick={() => setIcon(key)}
                        >
                            <img
                                className={classes.iconImage}
                                alt={description}
                                src={href}
                            />
                        </div>
                    ))}
                </div>
            </ModalContent>

            <ModalActions>
                <ButtonStrip>
                    <Button
                        primary
                        disabled={!icon}
                        onClick={() => onChange({ icon })}
                    >
                        {i18n.t('Select')}
                    </Button>

                    <Button onClick={() => onChange({ icon: '' })}>
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
