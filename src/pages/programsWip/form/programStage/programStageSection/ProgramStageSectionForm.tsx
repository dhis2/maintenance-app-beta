import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, InputFieldFF } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import { FormBase, FormFooterWrapper } from '../../../../../components'
import styles from '../../sectionForm/EnrollmentSectionFormContents.module.css'

export const ProgramStageSectionForm = ({
    onCancel,
}: {
    onCancel?: () => void
}) => (
    <FormBase initialValues={{}} onSubmit={() => {}} includeAttributes={false}>
        <h1>Some stage section stuff here</h1>
        <div>
            <ProgramStageSectionFormFields />
            <FieldRFF
                component={InputFieldFF}
                inputWidth="400px"
                name="testStageSection"
                label={i18n.t('Test input stage section')}
                validateFields={[]}
            />
            <FormFooterWrapper>
                <ButtonStrip>
                    <Button
                        primary
                        small
                        type="button"
                        onClick={() => {
                            console.log(
                                '*********** SUBMITTING STAGE SECTION FORM'
                            )
                        }}
                    >
                        {i18n.t('Save section')}
                    </Button>
                    <Button secondary small onClick={onCancel}>
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
                <div className={styles.actionsInfo}>
                    <IconInfo16 />
                    <p>
                        {i18n.t(
                            'Saving a stage section does not save other changes to the stage'
                        )}
                    </p>
                </div>
            </FormFooterWrapper>
        </div>
    </FormBase>
)

const ProgramStageSectionFormFields = () => {
    const { values } = useFormState({ subscription: { values: true } })

    return (
        <div>
            <div>FORM VALUES: {values && JSON.stringify(values)}</div>
            <br />
        </div>
    )
}
