export const DRAWER_PORTAL_ID = 'drawer-portal'

export const HEADER_BAR_HEIGHTS = {
    NEW_SHELL: 40,
    LEGACY: 48,
} as const

export type DrawerLevel = 'primary' | 'secondary'

export const DRAWER_WIDTHS: Record<DrawerLevel, string> = {
    primary: '95vw',
    secondary: '80%',
} as const
