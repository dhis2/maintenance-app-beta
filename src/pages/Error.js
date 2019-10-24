import React from 'react'

import { Container } from '../modules/layout/Container'
import { Content } from '../modules/layout/Content'

export const Error = ({ error }) => (
    <Container>
        <Content>
            <div>{`Error: ${error.message}`}</div>
        </Content>
    </Container>
)
