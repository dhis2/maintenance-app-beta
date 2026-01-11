import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'

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

    const options = useMemo(() => {
        if (!programData?.programTrackedEntityAttributes) {
            return []
        }
        return programData.programTrackedEntityAttributes.map(
            (ptea) => ptea.trackedEntityAttribute
        )
    }, [programData])

    if (!program?.id) {
        return null
    }

    return (
        <FieldRFF
            name="trackedEntityAttribute"
            render={({ input, meta }) => (
                <SingleSelectFieldFF
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    dataTest="trackedEntityAttribute-field"
                    label={i18n.t('Tracked entity attribute')}
                    options={options.map((tea) => ({
                        value: tea.id,
                        label: tea.displayName,
                    }))}
                    placeholder={i18n.t('Select tracked entity attribute')}
                    loading={!programData}
                />
            )}
        />
    )
}
