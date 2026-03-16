import i18n from '@dhis2/d2-i18n'
import { Box, Field } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { SearchableSingleSelect } from '../../../components'
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

    const { data: programData, refetch } = useQuery({
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

    const options = useMemo(
        () =>
            availableTrackedEntityAttributes.map((tea) => ({
                value: tea.id,
                label: tea.displayName || tea.id,
            })),
        [availableTrackedEntityAttributes]
    )

    const attributeById = useMemo(
        () =>
            new Map(
                availableTrackedEntityAttributes.map((tea) => [tea.id, tea])
            ),
        [availableTrackedEntityAttributes]
    )

    const handleChange = useCallback(
        (selectedId: string) => {
            const selected = selectedId
                ? attributeById.get(selectedId) ?? {
                      id: selectedId,
                      displayName: selectedId,
                  }
                : undefined
            trackedEntityAttributeInput.onChange(selected)
            trackedEntityAttributeInput.onBlur()
        },
        [attributeById, trackedEntityAttributeInput]
    )

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
                        <SearchableSingleSelect
                            options={options}
                            selected={input.value?.id}
                            onChange={({ selected }) => handleChange(selected)}
                            invalid={meta.touched && !!meta.error}
                            loading={!programData}
                            onRetryClick={() => refetch()}
                            showEndLoader={false}
                        />
                    </Box>
                </Field>
            )}
        />
    )
}
