import { SectionName } from '../../../lib'
import type { ModelPropertyDescriptor } from '../../../lib'

export interface ModelListView {
    name: string
    sectionModel: string
    columns: ReadonlyArray<ModelPropertyDescriptor>
    filters: ReadonlyArray<ModelPropertyDescriptor>
}

export type ModelListViews = {
    [key in SectionName]?: ModelListView[]
}
