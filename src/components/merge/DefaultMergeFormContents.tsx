import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { DefaultFormErrorNotice } from '../form/DefaultFormErrorNotice'
import { LinkButton } from '../LinkButton'

export const DefaultMergeFormContents = ({
    children,
}: React.PropsWithChildren) => {
    const { submitting, submitSucceeded } = useFormState({
        subscription: { submitting: true, submitSucceeded: true },
    })

    if (submitSucceeded) {
        return <MergeComplete />
    }

    return (
        <div>
            {submitting && <MergeInProgress />}
            {!submitting && !submitSucceeded && (
                <>
                    {children}
                    <DefaultFormErrorNotice />
                    <MergeActions />
                </>
            )}
        </div>
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

export const MergeComplete = () => {
    return (
        <div>
            <h2>Merge complete</h2>
            <LinkButton to="../">{i18n.t('Back to list')}</LinkButton>
        </div>
    )
}
