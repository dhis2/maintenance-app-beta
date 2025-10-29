import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import {
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    SectionedFormSection,
} from '../../../../components'
import { CustomFormEditEntry } from '../../../../components/customForm/CustomFormEditEntry'
import { SectionFormSectionsList } from '../../../../components/formCreators/SectionFormList'
import {
    FormType,
    TabbedFormTypePicker,
} from '../../../../components/formCreators/TabbedFormTypePicker'
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
                {selectedFormType === FormType.SECTION && (
                    <SectionFormSectionsList
                        sectionsFieldName={'sections'}
                        SectionFormComponent={EditOrNewDataSetSectionForm}
                        schemaName={SchemaName.section}
                    />
                )}
                {selectedFormType === FormType.CUSTOM && (
                    <CustomFormEditEntry />
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
