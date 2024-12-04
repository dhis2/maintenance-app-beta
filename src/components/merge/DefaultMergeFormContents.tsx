import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { DefaultFormErrorNotice } from '../form/DefaultFormErrorNotice'
import { LinkButton } from '../LinkButton'
import { StandardFormSectionTitle } from '../standardForm'

export const DefaultMergeFormContents = ({
    children,
    title,
    mergeCompleteElement = <MergeComplete />,
}: React.PropsWithChildren<{
    title?: React.ReactNode
    mergeCompleteElement?: React.ReactElement
}>) => {
    const { submitting, submitSucceeded } = useFormState({
        subscription: { submitting: true, submitSucceeded: true },
    })

    if (submitSucceeded) {
        return mergeCompleteElement
    }

    if (submitting) {
        return (
            <>
                {title}
                <MergeInProgress />
            </>
        )
    }
    return (
        <>
            {title}
            {children}
            <DefaultFormErrorNotice />
            <MergeActions />
        </>
    )
}

export const MergeActions = () => {
    return (
        <ButtonStrip>
            <Button primary type="submit">
                {i18n.t('Merge')}
            </Button>
            <LinkButton to={'../'} secondary>
                {i18n.t('Cancel')}
            </LinkButton>
        </ButtonStrip>
    )
}

export const MergeInProgress = () => {
    return (
        <div>
            <CircularLoader small />
            Merging...
        </div>
    )
}

export const MergeComplete = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            <StandardFormSectionTitle>
                {i18n.t('Merge complete')}
            </StandardFormSectionTitle>
            {children}
            <LinkButton to="../">{i18n.t('Back to list')}</LinkButton>
        </div>
    )
}
