import { useDataQuery } from '@dhis2/app-runtime'

const findMaintenanceAppPath = modules =>
    modules.find(module => module.name === 'dhis-web-maintenance').namespace

const query = {
    info: { resource: 'system/info' },
    modules: { resource: 'action::menu/getModules' },
}

export const RedirectToOld = ({ location }) => {
    const { loading, error, data } = useDataQuery(query)

    if (!loading && !error) {
        const baseUrl = data.info.contextPath
        const maintenanceAppPath = findMaintenanceAppPath(data.modules.modules)
        const fullUrl = `${baseUrl}${maintenanceAppPath}#${location.pathname}`

        window.location.replace(fullUrl)
    }

    return ''
}
