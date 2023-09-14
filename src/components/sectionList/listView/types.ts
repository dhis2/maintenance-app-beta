import { SectionName } from '../../../constants'
import type { ModelPropertyDescriptor } from '../../../constants'

export interface ModelListView {
    name: string
    sectionModel: string
    columns: Array<ModelPropertyDescriptor>
    filters: Array<ModelPropertyDescriptor>
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView[]
}
