import React from 'react'

import { Container } from '../modules/layout/Container'
import { Content } from '../modules/layout/Content'

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
