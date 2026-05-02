type ProgramTEA = {
    mandatory: boolean
    trackedEntityAttribute: { id: string; displayName: string }
}

type ProgramSection = {
    id?: string
    deleted?: boolean
    trackedEntityAttributes?: Array<{ id: string }>
}

export const getMandatoryAttributesMissingFromSections = ({
    programTrackedEntityAttributes = [],
    programSections = [],
}: {
    programTrackedEntityAttributes?: ProgramTEA[]
    programSections?: ProgramSection[]
}): ProgramTEA[] => {
    const mandatoryAttributes = programTrackedEntityAttributes.filter(
        (attr) => attr.mandatory
    )
    if (mandatoryAttributes.length === 0) {
        return []
    }

    const assignedAttributeIds = new Set(
        programSections
            .filter((section) => !section.deleted)
            .flatMap((section) =>
                (section.trackedEntityAttributes ?? []).map((attr) => attr.id)
            )
    )

    return mandatoryAttributes.filter(
        (attr) => !assignedAttributeIds.has(attr.trackedEntityAttribute.id)
    )
}
