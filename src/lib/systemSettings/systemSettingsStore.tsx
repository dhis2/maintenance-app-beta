import { create } from 'zustand'
import type { SystemSettings, SystemSettingsKey } from '../../types'

export interface SystemSettingsStore {
    systemSettings: SystemSettings | undefined
    getSystemSettings: () => SystemSettings
    setSystemSettings: (systemSettings: SystemSettings) => void
    getSystemSetting: <TKey extends SystemSettingsKey>(
        settingsKey: TKey
    ) => SystemSettings[TKey]
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
        getSystemSetting: (settingsKey) =>
            get().getSystemSettings()[settingsKey],
    })
)

export const useSetSystemSettings = () =>
    useSystemSettingsStore((state) => state.setSystemSettings)

export const useSystemSettings = () =>
    useSystemSettingsStore((state) => state.getSystemSettings())

export const useSystemSetting = <TKey extends SystemSettingsKey>(
    settingsKey: TKey
) => useSystemSettingsStore((state) => state.getSystemSetting(settingsKey))
