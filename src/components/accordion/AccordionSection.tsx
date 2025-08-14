import React from 'react'
import { CircularLoader, IconChevronDown24, IconChevronRight24 } from '@dhis2/ui'
import styles from './accordion.module.css'

interface AccordionSectionProps {
    id: string
    title: string
    isOpen: boolean
    onToggle: () => void
    loading?: boolean
    children: React.ReactNode
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
    title,
    isOpen,
    onToggle,
    loading = false,
    children
}) => {
    return (
        <div className={styles.accordionSection}>
            <div
                className={styles.accordionHeader}
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onToggle()
                }}
            >
                {loading && <CircularLoader small />}
                {isOpen ? (
                    <IconChevronDown24 color="var(--colors-grey600)" />
                ) : (
                    <IconChevronRight24 color="var(--colors-grey600)" />
                )}
                <span className={styles.accordionTitle}>{title}</span>
            </div>

            {isOpen && <div className={styles.accordionContent}>{children}</div>}
        </div>
    )
}
