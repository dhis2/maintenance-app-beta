import { FormType, DataSetFormValues } from './dataSetFormSchema'

/**
 * The formType is based on the presence of dataEntryForm and sections.
 * The formType property on dataSet is backend-computed, and is not "writable" - it's a
 * computed property with the same logic as below:
 *  https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/dataset/DataSet.java#L379
 */
export const getFormType = (
    partialDataSet: Pick<DataSetFormValues, 'sections' | 'dataEntryForm'>
): FormType => {
    if (partialDataSet.dataEntryForm) {
        return 'CUSTOM'
    }
    if (partialDataSet.sections && partialDataSet.sections.length > 0) {
        return 'SECTION'
    }
    return 'DEFAULT'
}
