import i18n from '@dhis2/d2-i18n'
import { Card, RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field, useFormState } from 'react-final-form'
import {
    HorizontalFieldGroup,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import classes from './FormFormContents.module.css'
import cx from 'classnames'
import css from '../../../app/layout/Layout.module.css'

const DefaultFormIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M10 6H22V8H10V6ZM10 10H22V12H10V10ZM10 24H16V26H10V24ZM10 14H16V16H10V14Z" />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24 4H8V28H24V4ZM6 2V30H26V2H6Z"
        />
    </svg>
)

const SectionFormIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M28 4H4V8H28V4ZM2 2V10H30V2H2Z"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M28 14H4V18H28V14ZM2 12V20H30V12H2Z"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M28 24H4V28H28V24ZM2 22V30H30V22H2Z"
        />
    </svg>
)

const CustomFormIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M31 16L24 23L22.59 21.59L28.17 16L22.59 10.41L24 9L31 16ZM1 16L8 9L9.41 10.41L3.83 16L9.41 21.59L8 23L1 16Z" />
        <path d="M12.4199 25.4835L17.6403 6.0008L19.5722 6.51843L14.3518 26.0012L12.4199 25.4835Z" />
    </svg>
)

const FormTypeCard = ({
    Icon,
    label,
    description,
    highlighted,
}: {
    Icon: React.ComponentType
    label: string
    description: string
    highlighted?: boolean
}) => {
    return (
        <div
            className={cx(classes.formTypeCardContent, {
                [classes.formTypeCardContentHighlihghted]: highlighted,
            })}
        >
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
    const formValues = useFormState().values
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
                                Icon={DefaultFormIcon}
                                label={i18n.t('Default form')}
                                description={i18n.t(
                                    'Data elements are displayed in a standard list'
                                )}
                                highlighted={
                                    formValues[formTypeFieldName] === 'DEFAULT'
                                }
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
                                Icon={SectionFormIcon}
                                label={i18n.t('Section form')}
                                description={i18n.t(
                                    'Group data into sections with additional options'
                                )}
                                highlighted={
                                    formValues[formTypeFieldName] === 'SECTION'
                                }
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
                                Icon={CustomFormIcon}
                                label={i18n.t('Custom form')}
                                description={i18n.t(
                                    'Build and style a custom form layout'
                                )}
                                highlighted={
                                    formValues[formTypeFieldName] === 'CUSTOM'
                                }
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
