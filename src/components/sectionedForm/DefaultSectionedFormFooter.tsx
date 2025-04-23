import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useForm } from 'react-final-form'
import { useSectionedFormContext, useSelectedSection } from '../../lib'
import { LinkButton } from '../LinkButton'
import { SectionedFormFooter } from './SectionedFormFooter'

export const DefaultSectionedFormFooter = ({
    submitting,
    dirty,
}: {
    submitting?: boolean
    dirty?: boolean
}) => {
    const descriptor = useSectionedFormContext()
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
                <Button
                    primary
                    type="submit"
                    onClick={submit}
                    loading={submitting}
                    disabled={!dirty || submitting}
                >
                    {i18n.t('Save and exit')}
                </Button>
                <LinkButton to={'..'}>
                    {i18n.t('Exit without saving')}
                </LinkButton>
            </SectionedFormFooter.FormActions>
        </SectionedFormFooter>
    )
}
