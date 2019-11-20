import React from 'react'

import { Container, Content } from '../modules'

export const Error = ({ error }) => (
    <Container>
        <Content>
            <div>{`Error: ${error}`}</div>
        </Content>
    </Container>
)
