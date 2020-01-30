import { useDispatch, useSelector } from 'react-redux'

import { Button, Modal } from '@dhis2/ui-core'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import propTypes from '@dhis2/prop-types'

import { Container, Content } from '../modules'
import { createTestNames } from '../utils/dataTest/createTestNames'
import { getAppDataError, loadAppData } from '../redux'

export const Error = ({ error }) => {
    const dispatch = useDispatch()
    const appError = useSelector(getAppDataError)

    return (
        <Container dataTest={createTestNames('page-error')}>
            <Content>
                <Modal open medium>
                    {/* Will be done properly once ModalTitle is available */}
                    <h1
                        style={{
                            padding: 20,
                            margin: 0,
                            borderBottom: '1px solid grey',
                            fontSize: 20,
                        }}
                    >
                        {i18n.t('Oops.. Looks like something went wrong')}
                    </h1>

                    {/* Will be done properly once ModalContent is available */}
                    <div
                        style={{
                            padding: 20,
                        }}
                    >
                        {error}
                    </div>

                    {/* Will be done properly once ModalFooter is available */}
                    {appError && (
                        <div
                            style={{
                                padding: 20,
                                borderTop: '1px solid grey',
                            }}
                        >
                            <Button
                                primary
                                onClick={() => dispatch(loadAppData())}
                            >
                                {i18n.t('Retry loading initial data')}
                            </Button>
                        </div>
                    )}
                </Modal>
            </Content>
        </Container>
    )
}

Error.propTypes = {
    error: propTypes.string.isRequired,
}
