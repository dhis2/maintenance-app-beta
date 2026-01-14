import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useBoundResourceQueryFn } from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

type Program = {
    programStages?: Array<{
        id: string
        programStageDataElements?: Array<{
            dataElement: {
                id: string
                displayName: string
            }
        }>
    }>
}

export function DataElementField() {
    const { input: programInput } = useField('program')
    const { input: sourceTypeInput } = useField('programRuleVariableSourceType')
    const { input: programStageInput } = useField('programStage')
    const queryFn = useBoundResourceQueryFn()

    const program = programInput.value
    const sourceType = sourceTypeInput.value
    const programStage = programStageInput.value

    const programQuery = useMemo(
        () => ({
            resource: 'programs',
            id: program?.id ?? '',
            params: {
                fields: [
                    'programStages[id,programStageDataElements[dataElement[id,displayName]]]',
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

    const dataElementOptions = useMemo(() => {
        if (!programData?.programStages) {
            return []
        }

        const stages = programData.programStages

        if (
            sourceType ===
                ProgramRuleVariable.programRuleVariableSourceType
                    .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE &&
            programStage?.id
        ) {
            const stage = stages.find((s) => s.id === programStage.id)
            return (
                stage?.programStageDataElements?.map(
                    (psde) => psde.dataElement
                ) || []
            )
        }

        return stages.flatMap(
            (stage) =>
                stage.programStageDataElements?.map(
                    (psde) => psde.dataElement
                ) || []
        )
    }, [programData, sourceType, programStage?.id])

    const options = [
        { label: i18n.t('<No value>'), value: '' },
        ...dataElementOptions.map((de) => ({
            value: de.id,
            label: de.displayName,
        })),
    ]

    if (!program?.id) {
        return null
    }

    return (
        <FieldRFF
            name="dataElement"
            format={(value) => (value?.id ? value.id : '')}
            parse={(value) =>
                value && value !== '' ? { id: value } : undefined
            }
            render={({ input, meta }) => (
                <SingleSelectFieldFF
                    input={input}
                    meta={meta}
                    inputWidth="400px"
                    dataTest="dataElement-field"
                    label={i18n.t('Data element')}
                    options={options}
                    loading={!programData}
                />
            )}
        />
    )
}
