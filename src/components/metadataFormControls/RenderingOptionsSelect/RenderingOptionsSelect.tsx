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

const nonSupportedRenderingOptions: Record<
    string,
    Record<'MOBILE' | 'DESKTOP', string[]>
> = {
    TRUE_ONLY: {
        MOBILE: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'VERTICAL_CHECKBOXES',
            'HORIZONTAL_CHECKBOXES',
        ],
        DESKTOP: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'VERTICAL_CHECKBOXES',
            'HORIZONTAL_CHECKBOXES',
        ],
    },
    BOOLEAN: { MOBILE: ['TOGGLE'], DESKTOP: ['TOGGLE'] },
    INTEGER: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    INTEGER_POSITIVE: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    INTEGER_NEGATIVE: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    INTEGER_ZERO_OR_POSITIVE: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    NUMBER: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    UNIT_INTERVAL: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    PERCENTAGE: { MOBILE: ['SPINNER'], DESKTOP: ['SPINNER'] },
    TEXT: { MOBILE: [], DESKTOP: ['GS1_DATAMATRIX'] },
    IMAGE: { MOBILE: [], DESKTOP: ['CANVAS'] },
    MULTI_TEXT: {
        MOBILE: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'SPINNER',
            'ICON',
            'SHARED_HEADER_RADIOBUTTONS',
        ],
        DESKTOP: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'SPINNER',
            'ICON',
            'SHARED_HEADER_RADIOBUTTONS',
        ],
    },
}

const nonSupportedRenderingOptionsWhenOptionSet: Record<
    string,
    Record<'MOBILE' | 'DESKTOP', string[]>
> = {
    MULTI_TEXT: {
        MOBILE: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'SPINNER',
            'ICON',
            'SHARED_HEADER_RADIOBUTTONS',
        ],
        DESKTOP: [
            'VERTICAL_RADIOBUTTONS',
            'HORIZONTAL_RADIOBUTTONS',
            'SPINNER',
            'ICON',
            'SHARED_HEADER_RADIOBUTTONS',
        ],
    },
    TEXT: {
        MOBILE: ['SPINNER', 'ICON'],
        DESKTOP: ['SPINNER', 'ICON', 'VERTICAL_RADIOBUTTONS'],
    },
    LONG_TEXT: {
        MOBILE: [
            'DROPDOWN',
            'HORIZONTAL_RADIOBUTTONS',
            'VERTICAL_CHECKBOXES',
            'HORIZONTAL_CHECKBOXES',
            'SHARED_HEADER_RADIOBUTTONS',
            'ICONS_AS_BUTTONS',
            'SPINNER',
            'ICON',
        ],
        DESKTOP: [
            'DROPDOWN',
            'HORIZONTAL_RADIOBUTTONS',
            'VERTICAL_CHECKBOXES',
            'HORIZONTAL_CHECKBOXES',
            'SHARED_HEADER_RADIOBUTTONS',
            'ICONS_AS_BUTTONS',
            'SPINNER',
            'ICON',
        ],
    },
    OPTION_SET: { MOBILE: ['SPINNER', 'ICON'], DESKTOP: ['SPINNER', 'ICON'] },
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

    const getOptionsFromData = () => {
        if (hasOptionSet) {
            const nonSupported = valueType
                ? nonSupportedRenderingOptionsWhenOptionSet[valueType]?.[device]
                : nonSupportedRenderingOptionsWhenOptionSet.OPTION_SET[device]
            return (
                data
                    ?.filter((ro) => ro.hasOptionSet)
                    ?.find((ro) => ro.clazz.toLowerCase().includes(classLookup))
                    ?.renderingTypes.map((rt) => ({
                        value: rt,
                        label: getConstantTranslation(rt),
                    }))
                    ?.filter((rt) => !nonSupported.includes(rt.value)) ?? []
            )
        } else {
            const nonSupported =
                nonSupportedRenderingOptions[valueType]?.[device]
            return (
                data
                    ?.filter((ro) => ro.valueType === valueType)
                    ?.find((ro) => ro.clazz.toLowerCase().includes(classLookup))
                    ?.renderingTypes.map((rt) => ({
                        value: rt,
                        label: getConstantTranslation(rt),
                    }))
                    ?.filter((rt) => !nonSupported.includes(rt.value)) ?? []
            )
        }
    }

    const optionsFromData = getOptionsFromData()

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
