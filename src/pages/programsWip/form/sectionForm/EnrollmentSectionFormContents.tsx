import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import {
    FormFooterWrapper,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { DefaultFormErrorNotice } from '../../../../components/form/DefaultFormErrorNotice'
import styles from './EnrollmentSectionFormContents.module.css'
import {
    enrollmentSectionSchemaSection,
    SectionFormValues,
} from './EntrollmentSectionForm'

export type EnrollmentSectionFormProps = {
    onCancel?: () => void
}

export const EnrollmentSectionFormContents = ({
    onCancel,
}: EnrollmentSectionFormProps) => {
    const form = useForm<SectionFormValues>()
    const { submitting, values } = useFormState({
        subscription: { submitting: true, values: true },
    })

    return (
        <div className={styles.sectionsWrapper}>
            <div>
                <SectionedFormSections>
                    <SectionedFormSection name="setup">
                        <StandardFormSectionTitle>
                            {i18n.t('Section setup')}
                        </StandardFormSectionTitle>
                        <StandardFormSectionDescription>
                            {i18n.t(
                                'Setup the basic information for this section.'
                            )}
                        </StandardFormSectionDescription>
                        <StandardFormField>
                            <NameField
                                schemaSection={enrollmentSectionSchemaSection}
                            />
                        </StandardFormField>
                    </SectionedFormSection>
                </SectionedFormSections>
                <div className={styles.errorNoticeWrapper}>
                    <DefaultFormErrorNotice />
                </div>
            </div>
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            disabled={submitting}
                            type="button"
                            onClick={() => form.submit()}
                            loading={submitting}
                            dataTest="form-submit-button"
                        >
                            {i18n.t('Save section')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={submitting}
                            onClick={onCancel}
                            dataTest="form-cancel-link"
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                'Saving a section does not save other changes to the program'
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </div>
    )
}
