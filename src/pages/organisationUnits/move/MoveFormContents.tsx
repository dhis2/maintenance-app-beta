import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { DefaultFormErrorNotice } from '../../../components/form/DefaultFormErrorNotice'
import { LinkButton } from '../../../components/LinkButton'
import css from './Move.module.css'
import { MoveOrgUnitFormFields } from './MoveOrgUnitFormFields'
import { MoveOrgUnitSummary } from './MoveOrgUnitSummary'

export const MoveFormContent = () => {
    const { values, valid } = useFormState({
        subscription: { values: true, valid: true },
    })

    return (
        <div className={css.moveForm}>
            <h2 className={css.title}>{i18n.t('Move organisation units')}</h2>
            <div className={css.description}>
                <p>
                    {i18n.t(
                        'Choose the organisation units to move and their new position in the hierarchy. All descendants move with them.'
                    )}
                </p>
            </div>

            <MoveOrgUnitFormFields />

            <MoveOrgUnitSummary
                sources={values.sources}
                target={values.target}
            />
            <DefaultFormErrorNotice />

            <ButtonStrip className={css.actions}>
                <Button
                    primary
                    type="submit"
                    disabled={
                        values.sources?.length === 0 || !values.target || !valid
                    }
                >
                    {i18n.t('Move')}
                </Button>
                <LinkButton secondary to="../">
                    {i18n.t('Cancel')}
                </LinkButton>
            </ButtonStrip>
        </div>
    )
}
