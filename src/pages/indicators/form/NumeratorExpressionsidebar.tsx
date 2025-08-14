
import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import styles from './NumeratorExpressionSidebar.module.css'
import { DefaultExpressionSection } from './DefaultExpressionSection'

interface NumeratorExpressionSidebarProps {
    onInsert: (value: string) => void
}

export default function NumeratorExpressionSidebar({
    onInsert
}: NumeratorExpressionSidebarProps) {
    const [openSection, setOpenSection] = useState<string | null>(null)

    const handleToggle = (id: string) => {
        setOpenSection(prev => (prev === id ? null : id))
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.accordionContainer}>
                <DefaultExpressionSection
                    id="dataElements"
                    title={i18n.t('Data elements')}
                    resource="dataElementOperands"
                    onInsert={onInsert}
                    isOpen={openSection === 'dataElements'}
                    onToggle={() => handleToggle('dataElements')}
                    fields={['id', 'displayName']}
                    paginate={true}
                    pageSize={50}
                    staticFilters={['dataElement.domainType:eq:AGGREGATE']}
                />

                <DefaultExpressionSection
                    id="programs"
                    title={i18n.t('Program variables')}
                    resource="programs"
                    onInsert={onInsert}
                    isOpen={openSection === 'programs'}
                    onToggle={() => handleToggle('programs')}
                    fields={['id', 'displayName']}
                />

                <DefaultExpressionSection
                    id="orgUnitGroups"
                    title={i18n.t('Organisation unit groups')}
                    resource="organisationUnitGroups"
                    onInsert={onInsert}
                    isOpen={openSection === 'orgUnitGroups'}
                    onToggle={() => handleToggle('orgUnitGroups')}
                    fields={['id', 'displayName']}
                />

                <DefaultExpressionSection
                    id="constants"
                    title={i18n.t('Constants')}
                    resource="constants"
                    onInsert={onInsert}
                    isOpen={openSection === 'constants'}
                    onToggle={() => handleToggle('constants')}
                    fields={['id', 'displayName']}
                />

                <DefaultExpressionSection
                    id="dataSets"
                    title={i18n.t('Reporting Rates')}
                    resource="dataSets"
                    onInsert={onInsert}
                    isOpen={openSection === 'dataSets'}
                    onToggle={() => handleToggle('dataSets')}
                    fields={['id', 'displayName']}
                />
            </div>
        </div>
    )
}