import React from 'react'
import { createPageComponent } from './createPageComponent'

export const NoAuthority = createPageComponent(() => (
    <span>
        You don't have the authority to view this section of the Maintnenace app
    </span>
))
