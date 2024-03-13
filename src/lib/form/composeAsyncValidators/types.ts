type ReturnValue = string | undefined

export type FormFieldValidator<Value, FormValues = object> = (
    value?: Value,
    formValues?: FormValues
) => ReturnValue | Promise<ReturnValue>
