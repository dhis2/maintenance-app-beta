import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Field as FieldRFF, FieldRenderProps } from 'react-final-form'
import { getConstantTranslation, useBoundResourceQueryFn } from '../../../lib'

type RenderingOptionsResponse = {
    renderingTypes: string[]
    hasOptionSet: boolean
    valueType?: string
    clazz: string
}[]

type RenderingOptionsSelectProps = {
    fieldName: string
    index: number
    device: 'MOBILE' | 'DESKTOP'
    valueType: string
    hasOptionSet: boolean
    required?: boolean
}

const nonSupportedRenderingOptions: Record<string, string[]> = {
    TRUE_ONLY: [
        'VERTICAL_RADIOBUTTONS',
        'HORIZONTAL_RADIOBUTTONS',
        'VERTICAL_CHECKBOXES',
        'HORIZONTAL_CHECKBOXES',
    ],
    BOOLEAN: ['TOGGLE'],
    INTEGER: ['SPINNER'],
    INTEGER_POSITIVE: ['SPINNER'],
    INTEGER_NEGATIVE: ['SPINNER'],
    INTEGER_ZERO_OR_POSITIVE: ['SPINNER'],
    NUMBER: ['SPINNER'],
    UNIT_INTERVAL: ['SPINNER'],
    PERCENTAGE: ['SPINNER'],
    TEXT: [],
    IMAGE: [],
    MULTI_TEXT: ['SPINNER', 'ICON'],
}

export const RenderingOptionsSelect = ({
    fieldName,
    index,
    device,
    valueType,
    hasOptionSet,
    required = false,
}: RenderingOptionsSelectProps) => {
    const queryFn = useBoundResourceQueryFn()
    const classLookup =
        fieldName === 'programStageDataElements'
            ? 'programstagedataelement'
            : 'programtrackedentityattribute'

    const { data, isLoading } = useQuery({
        queryKey: [
            {
                resource: 'staticConfiguration/renderingOptions',
            },
        ],
        queryFn: queryFn<RenderingOptionsResponse>,
    })

    const optionsFromData =
        (hasOptionSet
            ? data
                  ?.filter((ro) => ro.hasOptionSet)
                  ?.find((ro) => ro.clazz.toLowerCase().includes(classLookup))
                  ?.renderingTypes.map((rt) => ({
                      value: rt,
                      label: getConstantTranslation(rt),
                  }))
                  ?.filter(
                      (rt) =>
                          !nonSupportedRenderingOptions.MULTI_TEXT?.includes(
                              rt.value
                          )
                  )
            : data
                  ?.filter((ro) => ro.valueType === valueType)
                  ?.find((ro) => ro.clazz.toLowerCase().includes(classLookup))
                  ?.renderingTypes.map((rt) => ({
                      value: rt,
                      label: getConstantTranslation(rt),
                  }))
                  ?.filter(
                      (rt) =>
                          !nonSupportedRenderingOptions[valueType]?.includes(
                              rt.value
                          )
                  )) ?? []

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
