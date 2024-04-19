import { FormApi, FieldState, Unsubscribe } from 'final-form'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-final-form'
import { DataElement } from '../../types/generated'

const createBoundApi = <TFormValues>(form: FormApi<TFormValues>) => {
    const subscriptions: Unsubscribe[] = []

    const api = {
        when: <Fieldname extends keyof TFormValues>(
            fieldName: Fieldname,
            cb: (field: FieldState<TFormValues[Fieldname]>) => void
        ) => {
            const unsubscribe = form.registerField(
                fieldName,
                (field) => {
                    console.log('field', field)
                    // ony run rules when blurred (not active) and it has been touched
                    if (field.active === false) {
                        form.batch(() => {
                            cb(field)
                        })
                    }
                },
                { active: true, value: true, touched: true }
            )
            subscriptions.push(unsubscribe)
        },
        hide: <Fieldname extends keyof TFormValues>(
            fieldname: Fieldname,
            hidden: boolean
        ) => {
            form.mutators.setFieldData(fieldname, { hidden })
        },
        disable: <Fieldname extends keyof TFormValues>(
            fieldname: Fieldname,
            disabled: boolean
        ) => {
            form.mutators.setFieldData(fieldname, { disabled })
        },
    }

    return {
        api,
        unsubscribe: () => {
            subscriptions.forEach((unsubscribe) => {
                unsubscribe()
            })
        },
    }
}

// type FieldRulesApi<TFormValues> = {
//     when: <TFieldname extends keyof TFormValues>(
//         fieldName: TFieldname,
//         cb: (field: FieldState<TFormValues[TFieldname]>) => void
//     ) => FieldRulesApi<TFormValues>
// }

type FieldRulesApi<TFormValues> = ReturnType<
    typeof createBoundApi<TFormValues>
>['api']

type FieldRulesFunction<TFormValues> = (
    api: FieldRulesApi<TFormValues>,
    form: FormApi<TFormValues>
) => void

export const useRegisterFieldRules = <TFormValues extends Record<string, any>>(
    registerFieldRules: FieldRulesFunction<TFormValues>
) => {
    // don't react to updates, no need to memo this function
    const registerFunc = useRef(registerFieldRules)

    registerFunc.current = registerFieldRules
    const form = useForm<TFormValues>()

    useEffect(() => {
        const { api, unsubscribe } = createBoundApi<TFormValues>(form)

        // api.when('name', field => field.value.)
        registerFunc.current(api, form)
        console.log('register fieldrules')
        return () => {
            unsubscribe()
        }
    }, [form])
}

export const useDEFieldRules = () => {
    useRegisterFieldRules<DataElement>((api, form) => {
        api.when('domainType', (field) => {
            console.log('domainType changed', field)
            api.disable('categoryCombo', field.value === 'TRACKER')
        })
        api.when('optionSet', (field) => {
            console.log('optionset changed', field)
            console.log('field.value', field.value)
            api.disable('valueType', !!field.value)
            if (field.value) {
                form.change('valueType', field.value.valueType)
            }
        })
    })
}
