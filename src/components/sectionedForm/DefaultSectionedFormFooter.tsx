import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSectionedFormDescriptor, useSelectedSection } from '../../lib'
import { LinkButton } from '../LinkButton'
import { SectionedFormFooter } from './SectionedFormFooter'
import { useForm } from 'react-final-form'

export const DefaultSectionedFormFooter = () => {
    const descriptor = useSectionedFormDescriptor()
    const [selected, setSelectedSection] = useSelectedSection()

    const { submit } = useForm()
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
        <SectionedFormFooter>
            <SectionedFormFooter.SectionActions>
                {prevSection && (
                    <Button small onClick={handleNavigateBack}>
                        {i18n.t('Go back')}
                    </Button>
                )}
                {nextSection && (
                    <Button
                        style={{ marginInlineStart: 'auto' }}
                        small
                        onClick={handleNavigateNext}
                    >
                        {i18n.t('Next section')}
                    </Button>
                )}
            </SectionedFormFooter.SectionActions>
            <SectionedFormFooter.FormActions>
                <Button primary type="submit" onClick={submit}>
                    {i18n.t('Save and exit')}
                </Button>
                <LinkButton to={'..'}>
                    {i18n.t('Exit without saving')}
                </LinkButton>
            </SectionedFormFooter.FormActions>
        </SectionedFormFooter>
    )
}
