import React from 'react'

import { Container } from '../components/layout/Container'
import { Content } from '../components/layout/Content'

export const NoAuthority = () => (
    <Container>
        <Content>
            <span>
                You don't have the authority to view this section of the
                Maintnenace app
            </span>
        </Content>
    </Container>
)
