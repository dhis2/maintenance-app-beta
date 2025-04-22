import React, { useEffect, useState } from 'react'
import styles from './PiDisaggregationLayout.module.css'

const tabs = [
    { label: 'Program indicator mapping', id: 'programIndicatorMappings' },
    { label: 'Disaggregation categories', id: 'disaggregationCategories' },
    // { label: 'Attribute categories', id: 'attributeCategories' },
]

const PiDisaggregationLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].id)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting)
                if (visible?.target?.id) {
                    setActiveTab(visible.target.id)
                }
            },
            {
                rootMargin: '-100px 0px -70% 0px',
                threshold: 0.1,
            }
        )

        tabs.forEach((tab) => {
            const el = document.getElementById(tab.id)
            if (el) {
                observer.observe(el)
            }
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className={styles.layoutWrapper}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    {tabs.map((tab) => {
                        const handleClick = () => {
                            const el = document.getElementById(tab.id)
                            if (el) {
                                el.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                })
                            }
                            setActiveTab(tab.id)
                        }

                        return (
                            <button
                                key={tab.id}
                                onClick={handleClick}
                                className={`${styles.navItem} ${
                                    activeTab === tab.id
                                        ? styles.activeNavItem
                                        : ''
                                }`}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </aside>
            <main className={styles.content}>{children}</main>
        </div>
    )
}

export default PiDisaggregationLayout

export const PiSectionedFormFooter = ({
    children,
}: {
    children?: React.ReactNode
}) => {
    return <div className={styles.footer}>{children}</div>
}

const FormActions = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.actions}>{children}</div>
)

FormActions.displayName = 'PiSectionedFormFooter.FormActions'

PiSectionedFormFooter.FormActions = FormActions
