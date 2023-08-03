import { create } from 'zustand'
import type { SystemSettings, SystemSettingsKey } from '../../types'

export interface SystemSettingsStore {
    systemSettings: SystemSettings | undefined
    getSystemSettings: () => SystemSettings
    setSystemSettings: (systemSettings: SystemSettings) => void
    getSystemSetting: (
        settingsKey: SystemSettingsKey
    ) => SystemSettings[typeof settingsKey]
}

export const useSystemSettingsStore = create<SystemSettingsStore>()(
    (set, get) => ({
        systemSettings: undefined,
        getSystemSettings: () => {
            const systemSettings = get().systemSettings

            if (systemSettings === undefined) {
                throw new Error('SystemSettings not loaded')
            }

            return systemSettings
        },
        setSystemSettings: (systemSettings: SystemSettings) =>
            set({ systemSettings }),
        getSystemSetting: (settingsKey: SystemSettingsKey) =>
            get().getSystemSettings()[settingsKey],
    })
)

export const useSetSystemSettings = () =>
    useSystemSettingsStore((state) => state.setSystemSettings)

export const useSystemSettings = () =>
    useSystemSettingsStore((state) => state.getSystemSettings())

export const useSystemSetting = (settingsKey: SystemSettingsKey) =>
    useSystemSettingsStore((state) => state.getSystemSetting(settingsKey))
