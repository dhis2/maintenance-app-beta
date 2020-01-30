import React from 'react'

import { Container, Content } from '../modules'
import { createTestNames } from '../utils/dataTest/createTestNames'

export const NoAuthority = () => (
    <Container dataTest={createTestNames('page-noauthority')}>
        <Content>
            <span>
                You don&apos;t have the authority to view this section of the
                Maintnenace app
            </span>
        </Content>
    </Container>
)
