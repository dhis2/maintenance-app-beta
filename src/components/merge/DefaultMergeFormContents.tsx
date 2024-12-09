import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, CircularLoader } from '@dhis2/ui'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import { useModelSectionHandleOrThrow } from '../../lib'
import { ModelSection } from '../../types'
import { DefaultFormErrorNotice } from '../form/DefaultFormErrorNotice'
import { LinkButton } from '../LinkButton'
import { StandardFormSectionTitle } from '../standardForm'
import css from './MergeForm.module.css'
import { MergeFormValuesBase } from './mergeSchemaBase'

export const DefaultMergeFormContents = ({
    children,
    title,
    mergeCompleteElement = <MergeComplete />,
    mergeInProgressElement,
}: React.PropsWithChildren<{
    title?: React.ReactNode
    mergeCompleteElement?: React.ReactElement
    mergeInProgressElement?: React.ReactElement
}>) => {
    const { submitting, submitSucceeded } = useFormState<MergeFormValuesBase>({
        subscription: { submitting: true, submitSucceeded: true },
    })
    const section = useModelSectionHandleOrThrow()

    if (submitSucceeded) {
        return mergeCompleteElement
    }

    if (submitting) {
        return (
            <>
                {title}
                {mergeInProgressElement ?? (
                    <MergeInProgress modelSection={section} />
                )}
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

export const MergeInProgress = ({
    modelSection,
}: {
    modelSection: ModelSection
}) => {
    const count = useField<string[]>('sources').input.value?.length
    const modelLabel =
        count === 1 ? modelSection.title : modelSection.titlePlural

    const inProgressLabel = count
        ? i18n.t('Merging {{count}} {{model}}...', {
              count: count,
              model: modelLabel,
          })
        : i18n.t('Merging...')

    return (
        <div className={css.mergeInProgress}>
            <CircularLoader small />
            {inProgressLabel}
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
