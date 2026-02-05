import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { PaddedContainer } from '../../../components/ExpressionBuilder/PaddedContainer'
import {
    ConstraintField,
    TrackedEntityTypeField,
    ProgramField,
    ProgramStageField,
    TrackedEntityAttributesField,
    DataElementsField,
    RelationshipSideFieldsProps,
} from '../fields'

export const RelationshipSideFields = ({
    prefix,
}: RelationshipSideFieldsProps) => {
    return (
        <PaddedContainer
            title={i18n.t(
                prefix === 'from'
                    ? 'Initiating side (From)'
                    : 'Receiving side (To)'
            )}
        >
            <ConstraintField prefix={prefix} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <TrackedEntityTypeField prefix={prefix} />
                <ProgramField prefix={prefix} />
                <ProgramStageField prefix={prefix} />
            </div>
            <TrackedEntityAttributesField prefix={prefix} />
            <DataElementsField prefix={prefix} />
        </PaddedContainer>
    )
}
