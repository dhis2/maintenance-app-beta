import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { useField, UseFieldConfig } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { CustomFormEditEntry } from '../../../components/customForm/CustomFormEditEntry'
import { SectionFormSectionsList } from '../../../components/formCreators/SectionFormList'
import {
    FormType,
    TabbedFormTypePicker,
} from '../../../components/formCreators/TabbedFormTypePicker'
import { SchemaName } from '../../../types'
import { ProgramValues } from '../Edit'
import { EditOrNewEnrollmentSectionForm } from './sectionForm/EntrollmentSectionForm'

const useProgramField = <T extends keyof ProgramValues>(
    name: T,
    options?: UseFieldConfig<ProgramValues[T], ProgramValues[T]>
) => useField<ProgramValues[T]>(name, options)

export const EnrollmentFormFormContents = React.memo(function FormFormContents({
    name,
}: {
    name: string
}) {
    const sections = useProgramField('programSections').input.value
    const dataEntryForm = useProgramField('dataEntryForm').input.value
    const trackedEntityAttributes = useProgramField(
        'programTrackedEntityAttributes'
    ).input.value
    const [selectedFormType, setSelectedFormType] = useState<FormType>(
        FormType.DEFAULT
    )
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Enrollment: Form', { nsSeparator: '~:~' })}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose and configure the type of form that will be used to collect information during enrollment.'
                )}
            </StandardFormSectionDescription>
            <TabbedFormTypePicker
                sectionsLength={sections.length}
                hasDataEntryForm={!!dataEntryForm}
                hasDataToDisplay={trackedEntityAttributes.length > 0}
                onFormTypeChange={setSelectedFormType}
                selectedFormType={selectedFormType}
            >
                {selectedFormType === FormType.SECTION && (
                    <SectionFormSectionsList
                        sectionsFieldName={'programSections'}
                        SectionFormComponent={EditOrNewEnrollmentSectionForm}
                        schemaName={SchemaName.programSection}
                        otherProps={{ sectionsLength: sections.length }}
                    />
                )}
                {selectedFormType === FormType.CUSTOM && (
                    <CustomFormEditEntry />
                )}
            </TabbedFormTypePicker>
        </SectionedFormSection>
    )
})
