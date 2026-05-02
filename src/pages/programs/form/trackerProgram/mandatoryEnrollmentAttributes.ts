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

    const sections: SectionWithAttributes[] = Array.isArray(
        values.programSections
    )
        ? (values.programSections as SectionWithAttributes[])
        : []

    const assignedAttributeIds = new Set(
        sections
            .filter((section) => !section.deleted)
            .flatMap((section) =>
                (section.trackedEntityAttributes ?? []).map(
                    (attribute) => attribute.id
                )
            )
    )

    return mandatoryAttributes.filter(
        (attribute) =>
<<<<<<< HEAD
            !assignedAttributeIds.has(
                attribute.trackedEntityAttribute?.id ?? ''
            )
=======
            !assignedAttributeIds.has(attribute.trackedEntityAttribute.id)
>>>>>>> 9b8bb46cfca2c399b51a9fb3aa8256fd34ca8a50
    )
}
