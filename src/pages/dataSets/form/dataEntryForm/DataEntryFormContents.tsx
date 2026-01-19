import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { createSearchParams, Link, useSearchParams } from 'react-router-dom'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    SectionedFormSection,
} from '../../../../components'
import { CustomFormEditEntry } from '../../../../components/customForm/CustomFormEditEntry'
import { useDataSetCustomFormElements } from '../../../../components/customForm/useGetCustomFormElements'
import { SectionFormSectionsList } from '../../../../components/formCreators/SectionFormList'
import {
    FormType,
    TabbedFormTypePicker,
} from '../../../../components/formCreators/TabbedFormTypePicker'
import { FORM_SECTION_PARAM_KEY, scrollToSection } from '../../../../lib'
import { SchemaName } from '../../../../types'
import { DisplayOptionsField } from '../DisplayOptionsField'
import { useDataSetField } from '../formHooks'
import classes from './DataEntryFormContents.module.css'
import { EditOrNewDataSetSectionForm } from './sectionForm'

export const DataEntryFromContents = React.memo(function FormFormContents({
    name,
}: {
    name: string
}) {
    const displayOptions = useDataSetField('displayOptions').input.value
    const sections = useDataSetField('sections').input.value
    const dataEntryForm = useDataSetField('dataEntryForm').input.value
    const dataSetElements = useDataSetField('dataSetElements').input.value
    const [selectedFormType, setSelectedFormType] = useState<FormType>(
        FormType.DEFAULT
    )
    const [searchParams] = useSearchParams()
    const toDataSearchParam = useMemo(
        () =>
            createSearchParams({
                ...searchParams,
                [FORM_SECTION_PARAM_KEY]: 'data',
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
    const { loading, elementTypes } = useDataSetCustomFormElements()

    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Data entry form')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose and configure how the data entry form looks and works for this data set.'
                )}
            </StandardFormSectionDescription>
            <TabbedFormTypePicker
                sectionsLength={sections.length}
                hasDataEntryForm={!!dataEntryForm}
                hasDataToDisplay={dataSetElements.length > 0}
                onFormTypeChange={setSelectedFormType}
                selectedFormType={selectedFormType}
            >
                {selectedFormType === FormType.DEFAULT && (
                    <div className={classes.basicFormDetails}>
                        <StandardFormSectionTitle>
                            {i18n.t('Basic form')}
                        </StandardFormSectionTitle>
                        <div className={classes.basicFormDescription}>
                            {i18n.t(
                                'This form displays an auto-generated list of the data elements defined for this data set.'
                            )}
                        </div>
                        <Link
                            to={{ search: toDataSearchParam }}
                            replace
                            onClick={() => {
                                scrollToSection('data')
                            }}
                        >
                            <Button secondary small>
                                {i18n.t('Edit the data elements')}
                            </Button>
                        </Link>
                    </div>
                )}
                {selectedFormType === FormType.SECTION && (
                    <SectionFormSectionsList
                        sectionsFieldName={'sections'}
                        SectionFormComponent={EditOrNewDataSetSectionForm}
                        schemaName={SchemaName.section}
                        level={'primary'}
                    />
                )}
                {selectedFormType === FormType.CUSTOM && (
                    <CustomFormEditEntry
                        level={'primary'}
                        loading={loading}
                        elementTypes={elementTypes}
                    />
                )}
                {displayOptions !== undefined && (
                    <div className={classes.displayOptions}>
                        <StandardFormSectionTitle>
                            {i18n.t('Display options')}
                        </StandardFormSectionTitle>
                        <DisplayOptionsField
                            withSectionsDisplayOptions={
                                selectedFormType === FormType.SECTION
                            }
                        />
                    </div>
                )}
            </TabbedFormTypePicker>
        </SectionedFormSection>
    )
})
