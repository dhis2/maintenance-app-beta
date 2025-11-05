import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import {
    DrawerPortal,
    FormFooterWrapper,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import styles from '../sectionForm/EnrollmentSectionFormContents.module.css'
import { ProgramStageSectionForm } from './programStageSection/ProgramStageSectionForm'
import { StageFormValues, stageSchemaSection } from './StageForm'

export type StageFormProps = {
    onCancel?: () => void
    setCloseOnSubmit: (closeOnSubmit: boolean) => void
}

export const StageFormContents = ({
    onCancel,
    setCloseOnSubmit,
}: StageFormProps) => {
    const [sectionsFormOpen, setSectionsFormOpen] = React.useState(false)
    const { values } = useFormState({ subscription: { values: true } })
    const form = useForm<StageFormValues>()

    return (
        <>
            <DrawerPortal
                isOpen={sectionsFormOpen}
                onClose={() => setSectionsFormOpen(false)}
            >
                <ProgramStageSectionForm
                    onCancel={() => setSectionsFormOpen(false)}
                />
            </DrawerPortal>
            <SectionedFormSections>
                <SectionedFormSection name="setup">
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure the basic information for this program stage.'
                        )}
                    </StandardFormSectionDescription>
                    <NameField schemaSection={stageSchemaSection} />
                    <div>FORM VALUES: {values && JSON.stringify(values)}</div>
                </SectionedFormSection>
                <SectionedFormSection name="form">
                    <StandardFormSectionTitle>
                        {i18n.t('Program stage form')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure the form for data collection for events in this program stage.'
                        )}
                    </StandardFormSectionDescription>
                    <Button
                        disabled={values.id === undefined}
                        onClick={() => {
                            setSectionsFormOpen(true)
                        }}
                    >
                        Create a section
                    </Button>
                </SectionedFormSection>
            </SectionedFormSections>
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            type="button"
                            onClick={() => {
                                setCloseOnSubmit(true)
                                form.submit()
                            }}
                        >
                            {i18n.t('Save and close')}
                        </Button>
                        <Button
                            primary
                            small
                            type="button"
                            onClick={() => {
                                setCloseOnSubmit(false)
                                form.submit()
                            }}
                        >
                            {i18n.t('Save ')}
                        </Button>
                        <Button secondary small onClick={onCancel}>
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                'Saving a stage does not save other changes to the program'
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </>
    )
}
