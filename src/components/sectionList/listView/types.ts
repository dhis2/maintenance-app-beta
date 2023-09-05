import { SectionName } from '../../../constants'

export interface ModelListView {
    name: string
    sectionModel: string
    columns: Array<ViewPropertyDescriptor>
    filters: Array<ViewPropertyDescriptor>
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView[]
}

export interface ViewPropertyDescriptor {
    label: string
    path: string
}
