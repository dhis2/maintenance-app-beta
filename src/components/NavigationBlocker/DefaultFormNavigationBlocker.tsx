import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    ButtonStrip,
    Button,
} from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { useBlocker } from 'react-router-dom'

export const DefaultFormNavigationBlocker = () => {
    const formState = useFormState({ subscription: { dirty: true } })

    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        return (
            formState.dirty &&
            currentLocation.pathname !== nextLocation.pathname
        )
    })

    if (blocker.state !== 'blocked') {
        return null
    }

    return (
        <Modal position="middle" onClose={blocker.reset}>
            <ModalTitle>Unsaved changes</ModalTitle>
            <ModalContent>
                <p>
                    {i18n.t(
                        'You have unsaved changes, are you sure you want to exit?'
                    )}
                </p>
                <ModalActions>
                    <ButtonStrip>
                        <Button secondary onClick={blocker.reset}>
                            {i18n.t('Stay')}
                        </Button>
                        <Button destructive onClick={blocker.proceed}>
                            {i18n.t('Exit')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    )
}
