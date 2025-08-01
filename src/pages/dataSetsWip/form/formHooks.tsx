import {
    useField,
    UseFieldConfig,
    useForm,
    useFormState,
} from 'react-final-form'
import { DataSetValues } from '../Edit'

// typed hooks for the form
export const useDataSetFormState = useFormState<DataSetValues>

export const useDataSetForm = useForm<DataSetValues>

export const useDataSetField = <T extends keyof DataSetValues>(
    name: T,
    options?: UseFieldConfig<DataSetValues[T], DataSetValues[T]>
) => useField<DataSetValues[T]>(name, options)
