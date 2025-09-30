import React from 'react'
import { SectionedFormSection } from '../../../components'

export const EnrollmentDataFormContents = React.memo(
    function SetupFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <></>
            </SectionedFormSection>
        )
    }
)
