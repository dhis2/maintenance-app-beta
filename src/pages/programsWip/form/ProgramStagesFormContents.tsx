import i18n from '@dhis2/d2-i18n'
import { Button, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import {
    DrawerPortal,
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ListInFormItem } from '../../../components/formCreators/SectionFormList'
import { FORM_SUBSECTION_PARAM_KEY } from '../../../lib'
import { SchemaName } from '../../../types'
import { Access, DisplayableModel } from '../../../types/models'
import {
    EditOrNewStageForm,
    SubmittedStageFormValues,
} from './programStage/StageForm'

export type ProgramStageListItem = {
    id: string
    displayName: string
    description?: string
    deleted?: boolean
    access?: Access
}

export const ProgramStagesFormContents = React.memo(
    function ProgramStagesContent({ name }: { name: string }) {
        const stagesFieldArray =
            useFieldArray<ProgramStageListItem>('programStages').fields
        const [stageFormOpen, setStageFormOpen] = React.useState<
            DisplayableModel | null | undefined
        >()
        const isStageFormOpen = !!stageFormOpen || stageFormOpen === null
        const { values } = useFormState({ subscription: { values: true } })
        const [searchParams, setSearchParams] = useSearchParams()

        const handleSubmittedStage = (
            values: SubmittedStageFormValues,
            closeOnSubmit: boolean = true
        ) => {
            const isEditSection = stageFormOpen && stageFormOpen.id

            if (closeOnSubmit) {
                setStageFormOpen(undefined)
            } else if (!isEditSection) {
                setStageFormOpen({
                    id: values.id,
                    displayName: values.displayName,
                })
            }
            if (isEditSection) {
                const index = stagesFieldArray.value.findIndex(
                    (s) => s.id === stageFormOpen.id
                )
                if (index !== -1) {
                    stagesFieldArray.update(index, values)
                }
            } else {
                stagesFieldArray.push(values)
            }
        }
        const onCloseStageForm = () => {
            const next = createSearchParams(searchParams)
            next.delete(FORM_SUBSECTION_PARAM_KEY)
            setSearchParams(next, { replace: true })
            setStageFormOpen(undefined)
        }

        return (
            <>
                <DrawerPortal
                    isOpen={isStageFormOpen}
                    onClose={onCloseStageForm}
                >
                    {stageFormOpen !== undefined && (
                        <div>
                            <EditOrNewStageForm
                                stage={stageFormOpen}
                                onCancel={onCloseStageForm}
                                onSubmitted={handleSubmittedStage}
                            />
                        </div>
                    )}
                </DrawerPortal>
                <SectionedFormSection name={name}>
                    <StandardFormSectionTitle>
                        {i18n.t('Program Stages')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Set up stages in this program.')}
                    </StandardFormSectionDescription>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        name="testProgram"
                        label={i18n.t('Test input program')}
                        validateFields={[]}
                    />
                    <div>FORM VALUES: {values && values.testProgram}</div>
                    <br />
                    <Button
                        onClick={() => {
                            setStageFormOpen(null)
                        }}
                    >
                        {i18n.t('Add a program stage')}
                    </Button>

                    {stagesFieldArray.value.map((stage) => (
                        <ListInFormItem
                            key={stage.id}
                            item={stage}
                            schemaName={SchemaName.programStage}
                            onClick={() => {
                                setStageFormOpen(stage)
                            }}
                            onDelete={() => {}}
                        />
                    ))}
                </SectionedFormSection>
            </>
        )
    }
)
