import i18n from '@dhis2/d2-i18n'
import { Card, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    HorizontalFieldGroup,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import classes from './FormFormContents.module.css'

const EmptyStateIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M3 17V3H61V17" stroke="#6C7787" strokeWidth="2" />
        <path d="M61 47L61 61L3 61L3 47" stroke="#6C7787" strokeWidth="2" />
        <rect
            x="3"
            y="20"
            width="58"
            height="24"
            fill="#FBFCFD"
            stroke="#404B5A"
            strokeWidth="2"
        />
        <path d="M8 32L22 32" stroke="#404B5A" strokeWidth="2" />
        <path d="M16 38L22 32L16 26" stroke="#404B5A" strokeWidth="2" />
        <path d="M28 26L56 26" stroke="#404B5A" strokeWidth="2" />
        <path d="M8 9L56 9" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M8 49L35 49" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M37 49L47 49" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M49 49L53 49" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M8 15L20 15" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M22 15L30 15" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M8 55H28" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M30 55L34 55" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M36 55L38 55" stroke="#A0ADBA" strokeWidth="2" />
        <path d="M28 38L56 38" stroke="#404B5A" strokeWidth="2" />
        <path d="M32 32L56 32" stroke="#404B5A" strokeWidth="2" />
    </svg>
)

const FormTypeCard = ({
    Icon,
    label,
    description,
}: {
    Icon: React.ComponentType
    label: string
    description: string
}) => {
    return (
        <div className={classes.formTypeCardContent}>
            {<Icon />}
            <div className={classes.formTypeTitle}>
                <h4>{label}</h4>
                <p>{description}</p>
            </div>
        </div>
    )
}

export const FormFormContents = ({ name }: { name: string }) => {
    const formTypeFieldName = 'formType'
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Data entry form')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose and configure how the data entry form looks and works for this data set.'
                )}
            </StandardFormSectionDescription>

            <HorizontalFieldGroup className={classes.formTypeCards}>
                <Card>
                    <Field<string | undefined>
                        name={formTypeFieldName}
                        component={RadioFieldFF}
                        label={
                            <FormTypeCard
                                Icon={EmptyStateIcon}
                                label={i18n.t('Default form')}
                                description={i18n.t(
                                    'Data elements are displayed in a standard list'
                                )}
                            />
                        }
                        className={classes.formTypeCard}
                        type="radio"
                        value={'DEFAULT'}
                    />
                </Card>
                <Card>
                    <Field<string | undefined>
                        name={formTypeFieldName}
                        component={RadioFieldFF}
                        label={
                            <FormTypeCard
                                Icon={EmptyStateIcon}
                                label={i18n.t('Section form')}
                                description={i18n.t(
                                    'Group data into sections with additional options'
                                )}
                            />
                        }
                        className={classes.formTypeCard}
                        type="radio"
                        value={'SECTION'}
                        disabled
                    />
                </Card>
                <Card>
                    <Field<string | undefined>
                        name={formTypeFieldName}
                        component={RadioFieldFF}
                        label={
                            <FormTypeCard
                                Icon={EmptyStateIcon}
                                label={i18n.t('Custom form')}
                                description={i18n.t(
                                    'Build and style a custom form layout'
                                )}
                            />
                        }
                        className={classes.formTypeCard}
                        type="radio"
                        value={'CUSTOM'}
                        disabled
                    />
                </Card>
            </HorizontalFieldGroup>
        </SectionedFormSection>
    )
}
