/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@dhis2/d2-i18n' {
    export function t(key: string, options?: any): string
    export function exists(key: string): boolean
}

declare module '@dhis2/ui'
declare module '@dhis2/ui-icons'

declare module '*.bmp' {
    const src: string
    export default src
}

declare module '*.jpg' {
    const src: string
    export default src
}

declare module '*.jpeg' {
    const src: string
    export default src
}

declare module '*.png' {
    const src: string
    export default src
}

declare module '*.svg' {
    import * as React from 'react'

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>

    const src: string
    export default src
}

declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
}

declare module '@dhis2/cypress-commands'
