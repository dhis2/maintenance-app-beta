import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { useSectionedFormDescriptor, useSelectedSection } from '../../lib'
import css from './SectionForm.module.css'

export const DefaultSectionedFormFooter = () => {
    const descriptor = useSectionedFormDescriptor()
    const [selected, setSelectedSection] = useSelectedSection()

    const currSelectedIndex = descriptor.sections.findIndex(
        (s) => s.name === selected
    )
    const prevSection = descriptor.sections[currSelectedIndex - 1]
    const nextSection = descriptor.sections[currSelectedIndex + 1]

    const handleNavigateBack = () => {
        if (prevSection) {
            setSelectedSection(prevSection.name)
        }
    }
    const handleNavigateNext = () => {
        if (nextSection) {
            setSelectedSection(nextSection.name)
        }
    }

    return (
        <div className={css.footerWrapper}>
            <div className={css.sectionActions}>
                {prevSection && (
                    <Button small onClick={handleNavigateBack}>
                        {i18n.t('Go back: {{sectionLabel}}', {
                            sectionLabel: prevSection.label,
                        })}
                    </Button>
                )}
                {nextSection && (
                    <Button small onClick={handleNavigateNext}>
                        {i18n.t('Next section: {{sectionLabel}}', {
                            sectionLabel: nextSection.label,
                        })}
                    </Button>
                )}
            </div>
            <span className={css.verticalDivider}>|</span>
            <div className={css.submitActions}>
                <Button small type="submit">
                    Save and exit
                </Button>
                <Button small>Exit without saving</Button>
            </div>
        </div>
    )
}
