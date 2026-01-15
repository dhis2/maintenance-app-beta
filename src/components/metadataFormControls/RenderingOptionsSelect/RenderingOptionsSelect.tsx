import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Field as FieldRFF, FieldRenderProps } from 'react-final-form'
import { getConstantTranslation, useBoundResourceQueryFn } from '../../../lib'

type RenderingOptionsResponse = {
    renderingTypes: string[]
    valueType: string
}[]

type RenderingOptionsSelectProps = {
    fieldName: string
    index: number
    device: 'MOBILE' | 'DESKTOP'
    valueType: string
    required?: boolean
}

export const RenderingOptionsSelect = ({
    fieldName,
    index,
    device,
    valueType,
    required = false,
}: RenderingOptionsSelectProps) => {
    const queryFn = useBoundResourceQueryFn()

    const { data, isLoading } = useQuery({
        queryKey: [
            {
                resource: 'staticConfiguration/renderingOptions',
                params: {
                    fields: ['renderingTypes', 'valueType'],
                },
            },
        ],
        queryFn: queryFn<RenderingOptionsResponse>,
    })

    const optionsFromData =
        data
            ?.find((ro) => ro.valueType === valueType)
            ?.renderingTypes.map((rt) => ({
                value: rt,
                label: getConstantTranslation(rt),
            })) ?? []

    return (
        <FieldRFF<string | undefined>
            inputWidth="100px"
            defaultValue={'DEFAULT'}
            name={`${fieldName}[${index}].renderType.${device}.type`}
            render={(props: FieldRenderProps<string | undefined>) => {
                const selectedOptions =
                    props.input.value &&
                    (!data ||
                        data.length === 0 ||
                        !optionsFromData.some(
                            (o) => o.value === props.input.value
                        ))
                        ? [
                              {
                                  value: props.input.value,
                                  label: getConstantTranslation(
                                      props.input.value
                                  ),
                              },
                          ]
                        : []

                const defaultOptions =
                    (optionsFromData && optionsFromData.length > 0) ||
                    selectedOptions.length
                        ? []
                        : [
                              {
                                  value: 'DEFAULT',
                                  label: getConstantTranslation('DEFAULT'),
                              },
                          ]

                return (
                    <SingleSelectFieldFF
                        {...props}
                        inputWidth={'150px'}
                        loading={isLoading}
                        required={required}
                        options={[
                            ...defaultOptions,
                            ...selectedOptions,
                            ...optionsFromData,
                        ]}
                    />
                )
            }}
        />
    )
}
