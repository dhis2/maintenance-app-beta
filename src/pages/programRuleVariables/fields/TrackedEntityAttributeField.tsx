import i18n from '@dhis2/d2-i18n'
import { Box, Field } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { BaseModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect/BaseModelSingleSelect'
import { required, useBoundResourceQueryFn } from '../../../lib'

type Program = {
    programTrackedEntityAttributes?: Array<{
        trackedEntityAttribute: {
            id: string
            displayName: string
        }
    }>
}

export function TrackedEntityAttributeField() {
    const { input: programInput } = useField('program')
    const queryFn = useBoundResourceQueryFn()

    const program = programInput.value
    const { input: trackedEntityAttributeInput } = useField(
        'trackedEntityAttribute'
    )
    const currentTrackedEntityAttribute = trackedEntityAttributeInput.value

    const programQuery = useMemo(
        () => ({
            resource: 'programs',
            id: program?.id ?? '',
            params: {
                fields: [
                    'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]',
                ],
            },
        }),
        [program?.id]
    )

    const { data: programData } = useQuery({
        queryKey: [programQuery],
        queryFn: queryFn<Program>,
        enabled: !!program?.id,
    })

    const trackedEntityAttributes = useMemo(() => {
        if (!programData?.programTrackedEntityAttributes) {
            return []
        }
        return programData.programTrackedEntityAttributes.map(
            (ptea) => ptea.trackedEntityAttribute
        )
    }, [programData])

    const availableTrackedEntityAttributes = useMemo(() => {
        const attributeMap = new Map(
            trackedEntityAttributes.map((tea) => [tea.id, tea])
        )

        if (
            currentTrackedEntityAttribute?.id &&
            !attributeMap.has(currentTrackedEntityAttribute.id)
        ) {
            attributeMap.set(currentTrackedEntityAttribute.id, {
                id: currentTrackedEntityAttribute.id,
                displayName:
                    currentTrackedEntityAttribute.displayName ||
                    currentTrackedEntityAttribute.id,
            })
        }

        return Array.from(attributeMap.values())
    }, [trackedEntityAttributes, currentTrackedEntityAttribute])

    if (!program?.id) {
        return null
    }

    return (
        <FieldRFF
            name="trackedEntityAttribute"
            validate={required}
            render={({ input, meta }) => (
                <Field
                    dataTest="trackedEntityAttribute-field"
                    error={meta.invalid}
                    validationText={
                        (meta.touched && meta.error?.toString()) || ''
                    }
                    name={input.name}
                    label={i18n.t('Tracked entity attribute')}
                    required
                >
                    <Box width="400px" minWidth="100px">
                        <BaseModelSingleSelect
                            available={availableTrackedEntityAttributes}
                            selected={input.value}
                            onChange={(selected) => {
                                input.onChange(selected)
                                input.onBlur()
                            }}
                            invalid={meta.touched && !!meta.error}
                            loading={!programData}
                            onRetryClick={() => {}}
                            showEndLoader={false}
                        />
                    </Box>
                </Field>
            )}
        />
    )
}
