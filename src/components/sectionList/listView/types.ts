import { SectionName } from '../../../lib'

export interface ModelListView {
    name: string
    sectionModel: string
    columns: string[]
    filters: string[]
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView[]
}
