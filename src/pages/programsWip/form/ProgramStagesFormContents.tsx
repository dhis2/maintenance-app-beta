import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, InputFieldFF } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import React, { useState } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import {
    DrawerPortal,
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ListInFormItem } from '../../../components/formCreators/SectionFormList'
import { SchemaName } from '../../../types'
import { Access, DisplayableModel } from '../../../types/models'
import {
    EditOrNewStageForm,
    StageFormActions,
    SubmittedStageFormValues,
} from './programStage/StageForm'
import css from './programStage/StageForm.module.css'

export type ProgramStageListItem = {
    id: string
    displayName: string
    description?: string
    deleted?: boolean
    access?: Access
    program?: { id: string }
}

export const ProgramStagesFormContents = React.memo(
    function ProgramStagesContent({ name }: { name: string }) {
        const stagesFieldArray =
            useFieldArray<ProgramStageListItem>('programStages').fields
        const [stageFormOpen, setStageFormOpen] = React.useState<
            DisplayableModel | null | undefined
        >()
        const [formActions, setFormActions] = useState<StageFormActions | null>(
            null
        )
        const isStageFormOpen = !!stageFormOpen || stageFormOpen === null

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
            setStageFormOpen(undefined)
            setFormActions(null)
        }

        const stageFormFooter = formActions && (
            <div className={css.stageFormFooter}>
                <ButtonStrip>
                    <Button primary small onClick={formActions.saveAndClose}>
                        {i18n.t('Save stage and close')}
                    </Button>
                    <Button secondary small onClick={formActions.save}>
                        {i18n.t('Save stage')}
                    </Button>
                    <Button secondary small onClick={onCloseStageForm}>
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
                <div className={css.actionsInfo}>
                    <IconInfo16 />
                    <p>
                        {i18n.t(
                            'Saving a stage does not save other changes to the program'
                        )}
                    </p>
                </div>
            </div>
        )

        return (
            <>
                <DrawerPortal
                    isOpen={isStageFormOpen}
                    onClose={onCloseStageForm}
                    title={
                        stageFormOpen === null
                            ? i18n.t('New stage')
                            : i18n.t('Edit stage')
                    }
                    footer={stageFormFooter}
                >
                    {stageFormOpen !== undefined && (
                        <EditOrNewStageForm
                            stage={stageFormOpen}
                            onCancel={onCloseStageForm}
                            onSubmitted={handleSubmittedStage}
                            onActionsReady={setFormActions}
                        />
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
