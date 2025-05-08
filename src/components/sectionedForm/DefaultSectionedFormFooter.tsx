import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useForm } from 'react-final-form'
import { LinkButton } from '../LinkButton'
import { SectionedFormFooter } from './SectionedFormFooter'

export const DefaultSectionedFormFooter = ({
    submitting,
}: {
    submitting?: boolean
}) => {
    const { submit } = useForm()

    return (
        <SectionedFormFooter>
            <SectionedFormFooter.FormActions>
                <Button
                    primary
                    type="submit"
                    onClick={submit}
                    loading={submitting}
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
