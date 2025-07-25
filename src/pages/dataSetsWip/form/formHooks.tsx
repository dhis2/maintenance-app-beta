import {
    useField,
    UseFieldConfig,
    useForm,
    useFormState,
} from 'react-final-form'
import { DataSetFormValues } from './dataSetFormSchema'

// typed hooks for the form
export const useDataSetFormState = useFormState<DataSetFormValues>

export const useDataSetForm = useForm<DataSetFormValues>

export const useDataSetField = <T extends keyof DataSetFormValues>(
    name: T,
    options?: UseFieldConfig<DataSetFormValues[T], DataSetFormValues[T]>
) => useField<DataSetFormValues[T]>(name, options)
