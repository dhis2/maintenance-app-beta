import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useFieldArray } from 'react-final-form-arrays'
import {
    SectionedFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { ListInFormItem } from '../../../components/formCreators/SectionFormList'
import { SchemaName } from '../../../types'
import { DisplayableModel } from '../../../types/models'
import { ProgramValues } from '../Edit'

export const ProgramStagesFormContents = React.memo(
    function ProgramStagesContent({ name }: { name: string }) {
        const stagesFieldArray =
            useFieldArray<ProgramValues['programStages'][0]>(
                'programStages'
            ).fields
        const [stageFormOpen, setStageFormOpen] = React.useState<
            DisplayableModel | null | undefined
        >()
        const isStageFormOpen = !!stageFormOpen || stageFormOpen === null

        return (
            <>
                <SectionedFormSection name={name}>
                    <StandardFormSectionTitle>
                        {i18n.t('Program Stages')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t('Set up stages in this program.')}
                    </StandardFormSectionDescription>
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
