import { create } from 'zustand'
import type { SystemSettings, SystemSettingsKey } from '../../types'

export interface SchemasStore {
    systemSettings: SystemSettings | undefined
    getSystemSettings: () => SystemSettings
    setSystemSettings: (systemSettings: SystemSettings) => void
    getSystemSetting: (
        settingsKey: SystemSettingsKey
    ) => SystemSettings[typeof settingsKey]
}

export const useSchemaStore = create<SchemasStore>()((set, get) => ({
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
}))

export const useSetSystemSettings = () =>
    useSchemaStore((state) => state.setSystemSettings)

export const useSystemSettings = () =>
    useSchemaStore((state) => state.getSystemSettings())

export const useSystemSetting = (settingsKey: SystemSettingsKey) =>
    useSchemaStore((state) => state.getSystemSetting(settingsKey))
