import { ProgramValues } from '../../EditTrackerProgram'

type SectionWithAttributes = ProgramValues['programSections'][number] & {
    deleted?: boolean
    trackedEntityAttributes?: Array<{ id: string }>
}

export const getMandatoryAttributesMissingFromSections = (
    values: Pick<
        ProgramValues,
        'programTrackedEntityAttributes' | 'programSections'
    >
) => {
    const mandatoryAttributes = (
        values.programTrackedEntityAttributes ?? []
    ).filter((attribute) => attribute.mandatory)

    if (mandatoryAttributes.length === 0) {
        return []
    }

    const assignedAttributeIds = new Set(
        (values.programSections as SectionWithAttributes[])
            .filter((section) => !section.deleted)
            .flatMap((section) =>
                (section.trackedEntityAttributes ?? []).map(
                    (attribute) => attribute.id
                )
            )
    )

    return mandatoryAttributes.filter(
        (attribute) =>
            !assignedAttributeIds.has(attribute.trackedEntityAttribute.id)
    )
}
