import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CurrentUser, UserAssignedOrganisationUnits } from '../useLoadApp'

export interface CurrentUserStore {
    currentUser: CurrentUser | undefined
    rootOrganisationUnits: UserAssignedOrganisationUnits
    getCurrentUser: () => CurrentUser
    setCurrentUser: (currentUser: CurrentUser) => void
    getRootOrganisationUnits: () => UserAssignedOrganisationUnits
}

export const useCurrentUserStore = create<CurrentUserStore>()(
    devtools((set, get) => ({
        currentUser: undefined,
        rootOrganisationUnits: [],
        getCurrentUser: () => {
            const currentUser = get().currentUser

            if (!currentUser) {
                throw new Error('currentUser not loaded')
            }

            return currentUser
        },
        setCurrentUser: (currentUser) => {
            const minumumOrgUnitLevel = Math.min(
                ...currentUser.organisationUnits.map((ou) => ou.level)
            )
            const rootOrganisationUnits = currentUser.organisationUnits.filter(
                (ou) => ou.level === minumumOrgUnitLevel
            )
            set({ currentUser, rootOrganisationUnits })
        },
        getRootOrganisationUnits: () => {
            return get().rootOrganisationUnits
        },
    }))
)

export const useSetCurrentUser = () =>
    useCurrentUserStore((state) => state.setCurrentUser)

export const useCurrentUser = () =>
    useCurrentUserStore((state) => state.getCurrentUser())

export const useCurrentUserAuthorities = () => {
    const authorities = useCurrentUserStore(
        (state) => state.getCurrentUser().authorities
    )
    return authorities
}

export const useCurrentUserRootOrgUnits = () => {
    const rootOrgUnits = useCurrentUserStore((state) =>
        state.getRootOrganisationUnits()
    )
    return rootOrgUnits
}
