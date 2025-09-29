import React from 'react'
import { SectionedFormSection } from '../../../components'

export const EnrollmentFormFormContents = React.memo(
    function SetupFormContents({ name }: { name: string }) {
        return (
            <SectionedFormSection name={name}>
                <></>
            </SectionedFormSection>
        )
    }
)
