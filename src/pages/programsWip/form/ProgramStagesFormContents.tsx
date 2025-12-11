import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
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

        const existingStages = stagesFieldArray.value.map((stage) => ({
            id: stage.id,
            name: stage.displayName,
            displayName: stage.displayName,
        }))

        const handleSubmittedStage = (
            values: SubmittedStageFormValues,
            closeOnSubmit: boolean = true
        ) => {
            const isEditMode = stageFormOpen && stageFormOpen.id

            if (isEditMode) {
                const index = stagesFieldArray.value.findIndex(
                    (s) => s.id === stageFormOpen.id
                )
                if (index !== -1) {
                    stagesFieldArray.update(index, values)
                }
            } else {
                stagesFieldArray.push(values)
            }

            if (closeOnSubmit) {
                setStageFormOpen(undefined)
            } else if (!isEditMode) {
                setStageFormOpen({
                    id: values.id,
                    displayName: values.displayName,
                })
            }
        }
        const handleCloseStageForm = () => setStageFormOpen(undefined)

        return (
            <>
                <DrawerPortal
                    isOpen={isStageFormOpen}
                    onClose={handleCloseStageForm}
                >
                    {stageFormOpen !== undefined && (
                        <EditOrNewStageForm
                            stage={stageFormOpen}
                            onCancel={handleCloseStageForm}
                            onSubmitted={handleSubmittedStage}
                            existingStages={existingStages}
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
                    <Button onClick={() => setStageFormOpen(null)}>
                        {i18n.t('Add a program stage')}
                    </Button>

                    {stagesFieldArray.value.map((stage) => (
                        <ListInFormItem
                            key={stage.id}
                            item={stage}
                            schemaName={SchemaName.programStage}
                            onClick={() => setStageFormOpen(stage)}
                            onDelete={() => {}}
                        />
                    ))}
                </SectionedFormSection>
            </>
        )
    }
)
