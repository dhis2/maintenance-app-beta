import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { findMinimumRootUnits } from '../organisationUnit'
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
            const rootOrganisationUnits = findMinimumRootUnits(
                currentUser.organisationUnits
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
