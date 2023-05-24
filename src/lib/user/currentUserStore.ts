import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CurrentUser } from '../useLoadApp'

export interface CurrentUserStore {
    currentUser: CurrentUser | undefined
    getCurrentUser: () => CurrentUser
    setCurrentUser: (currentUser: CurrentUser) => void
}

export const useCurrentUserStore = create<CurrentUserStore>()(
    devtools((set, get) => ({
        currentUser: undefined,
        getCurrentUser: () => {
            const currentUser = get().currentUser

            if (!currentUser) {
                throw new Error('currentUser not loaded')
            }

            return currentUser
        },
        setCurrentUser: (currentUser) => set({ currentUser }),
    }))
)

export const useSetCurrentUser = () =>
    useCurrentUserStore((state) => state.setCurrentUser)

export const useCurrentUser = () =>
    useCurrentUserStore((state) => state.getCurrentUser())

export const useCurrentUserAuthorities = () => {
    const currentUser = useCurrentUserStore((state) => state.getCurrentUser())
    return currentUser.authorities
}
