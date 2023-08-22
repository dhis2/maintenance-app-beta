import { SectionName } from '../../../constants'

export interface ModelListView {
    name: string
    sectionModel: SectionName
    columns: Array<ModelListViewColumn>
    filters: Array<ModelListViewFilter>
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView
}

interface ModelListViewColumn {
    label: string
    path: string
}

interface ModelListViewFilter {
    name: string
    path: string
}
