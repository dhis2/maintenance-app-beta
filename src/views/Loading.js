import { CircularLoader, ScreenCover } from '@dhis2/ui-core'
import React from 'react'

import { Container, Content } from '../modules'

export const Loading = () => (
    <Container>
        <Content>
            <ScreenCover>
                <CircularLoader />
            </ScreenCover>
        </Content>
    </Container>
)
