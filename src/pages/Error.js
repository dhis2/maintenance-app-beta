import React from 'react'
import { createPageComponent } from './createPageComponent'

export const Error = createPageComponent(({ error }) => (
    <div>{`Error: ${error.message}`}</div>
))
