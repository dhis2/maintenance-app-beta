import { SectionName } from '../../../lib'
import type { FilterDescriptor, ModelPropertyDescriptor } from '../../../lib'

export interface ModelListView {
    name: string
    sectionModel: string
    columns: ReadonlyArray<ModelPropertyDescriptor>
    filters: ReadonlyArray<FilterDescriptor>
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView[]
}
