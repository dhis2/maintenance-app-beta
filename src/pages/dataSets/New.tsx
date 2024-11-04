import React from 'react'
import {
    SectionedFormBase,
    SectionedFormSection,
    SectionFormField,
    useSectionedFormState,
} from '../../lib'
import { LinkButton } from '../../components/LinkButton'
import { NavLink } from 'react-router-dom'
export const Component = () => {
    const [inc, setInc] = React.useState(0)

    return (
        <div>
            <h1>New Data Set</h1>
            <p>This is where you can create a new data set</p>
            <div>
                <SectionedFormBase name="dataSet">
                    <SideBar />
                    <SectionedFormSection label="Basic" name="basic">
                        <div>
                            <SectionFormField name="name" label="Name">
                                <input type="text" />
                            </SectionFormField>
                        </div>
                    </SectionedFormSection>
                    <SectionedFormSection label="Advanced" name="advanced">
                        <div>
                            <SectionFormField name="name" label="Name">
                                <input type="text" />
                            </SectionFormField>
                        </div>
                    </SectionedFormSection>
                </SectionedFormBase>
                <input
                    type="button"
                    value="inc"
                    onClick={() => setInc(inc + 1)}
                />
            </div>
        </div>
    )
}

const SideBar = () => {
    const sections = useSectionedFormState((state) => state.sections)
    const state = useSectionedFormState()
    console.log({ sections })
    const sectionForField = state.getSectionsForField('name')
    console.log({ sectionForField })
    return (
        <div>
            <h2>Sections</h2>
            <ul>
                {sections.map((section) => (
                    <li key={section.name}>{section.label}</li>
                ))}
                <LinkButton to="/overview">Overview</LinkButton>
                <NavLink to={'/overview'}>Overview</NavLink>
            </ul>
        </div>
    )
}
