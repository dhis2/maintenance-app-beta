/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { App } from './App'
import type { Document } from './Document'
import type { EventVisualization } from './EventVisualization'
import type { Map } from './Map'
import type { Report } from './Report'
import type { Ref_SimpleEventVisualizationView } from './Ref_SimpleEventVisualizationView'
import type { Ref_SimpleVisualizationView } from './Ref_SimpleVisualizationView'
import type { User } from './User'

export type DashboardSearchResult = {
    appCount: number
    apps: Array<App>
    eventChartCount: number
    eventCharts: Array<EventVisualization>
    eventReportCount: number
    eventReports: Array<EventVisualization>
    eventVisualizationCount: number
    eventVisualizations: Array<Ref_SimpleEventVisualizationView>
    mapCount: number
    maps: Array<Map>
    reportCount: number
    reports: Array<Report>
    resourceCount: number
    resources: Array<Document>
    searchCount: number
    userCount: number
    users: Array<User>
    visualizationCount: number
    visualizations: Array<Ref_SimpleVisualizationView>
}
