import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useField, UseFieldConfig } from 'react-final-form'
import { createSearchParams, Link, useSearchParams } from 'react-router-dom'
import {
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { CustomFormEditEntry } from '../../../components/customForm/CustomFormEditEntry'
import { useProgramsCustomFormElements } from '../../../components/customForm/useGetCustomFormElements'
import { SectionFormSectionsList } from '../../../components/formCreators/SectionFormList'
import {
    FormType,
    TabbedFormTypePicker,
} from '../../../components/formCreators/TabbedFormTypePicker'
import { FORM_SECTION_PARAM_KEY, scrollToSection } from '../../../lib'
import { SchemaName } from '../../../types'
import { ProgramValues } from '../Edit'
import styles from './EnrollmentFormFormContents.module.css'
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
    const [searchParams] = useSearchParams()
    const toEnrollmentDataSearchParam = useMemo(
        () =>
            createSearchParams({
                ...searchParams,
                [FORM_SECTION_PARAM_KEY]: 'enrollmentData',
            }).toString(),
        [searchParams]
    )

    useEffect(() => {
        if (dataEntryForm) {
            setSelectedFormType(FormType.CUSTOM)
        } else if (sections.length > 0) {
            setSelectedFormType(FormType.SECTION)
        }
    }, [dataEntryForm, sections])
    const { loading, elementTypes } = useProgramsCustomFormElements()

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
                {selectedFormType === FormType.DEFAULT && (
                    <div className={styles.basicFormDetails}>
                        <StandardFormSectionTitle>
                            {i18n.t('Basic form')}
                        </StandardFormSectionTitle>
                        <div className={styles.basicFormDescription}>
                            {i18n.t(
                                'This form displays an auto-generated list of the tracked entity attributes defined for this program.'
                            )}
                        </div>
                        <Link
                            to={{ search: toEnrollmentDataSearchParam }}
                            replace
                            onClick={() => {
                                scrollToSection('enrollmentData')
                            }}
                        >
                            <Button secondary small>
                                {i18n.t(
                                    'Edit or rearrange the tracked entity attributes'
                                )}
                            </Button>
                        </Link>
                    </div>
                )}
                {selectedFormType === FormType.SECTION && (
                    <SectionFormSectionsList
                        sectionsFieldName={'programSections'}
                        SectionFormComponent={EditOrNewEnrollmentSectionForm}
                        schemaName={SchemaName.programSection}
                        level={'primary'}
                        otherProps={{ sectionsLength: sections.length }}
                    />
                )}
                {selectedFormType === FormType.CUSTOM && (
                    <CustomFormEditEntry
                        level={'primary'}
                        loading={loading}
                        elementTypes={elementTypes}
                    />
                )}
            </TabbedFormTypePicker>
        </SectionedFormSection>
    )
})
