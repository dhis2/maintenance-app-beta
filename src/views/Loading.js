import { CircularLoader, ScreenCover } from '@dhis2/ui-core'
import React from 'react'

import { Container, Content } from '../modules'
import { createTestNames } from '../utils/dataTest/createTestNames'

export const Loading = () => (
    <Container dataTest={createTestNames('page-loading')}>
        <Content>
            <ScreenCover>
                <CircularLoader />
            </ScreenCover>
        </Content>
    </Container>
)
