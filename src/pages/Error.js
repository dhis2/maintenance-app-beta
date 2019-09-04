import React from 'react'

import { Container } from '../components/layout/Container'
import { Content } from '../components/layout/Content'

export const Error = ({ error }) => (
    <Container>
        <Content>
            <div>{`Error: ${error.message}`}</div>
        </Content>
    </Container>
)
