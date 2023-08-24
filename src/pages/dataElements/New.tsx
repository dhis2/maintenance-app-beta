import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { StandardFormSection } from '../../components'
import { DataElementForm } from './form'
import classes from './New.module.css'

export const Component = () => {
    // @TODO(DataElements/new): values dynamic or static?
    const initialValues = {
        legends: [],
        domain: 'aggregate',
        valueType: 'number',
        aggregationType: 'sum',
    }

    const navigate = useNavigate()
    const onSubmit = (values: object) => {
        console.log(
            '@TODO(DataElements/new): Implement onSubmit; values:',
            values
        )
    }

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementForm />

                        <StandardFormSection>
                            <ButtonStrip>
                                <Button primary type="submit">
                                    Save and close
                                </Button>

                                <Button
                                    onClick={() => {
                                        alert(
                                            '@TODO(Data elements/new): Implement me!'
                                        )
                                        navigate(-1)
                                    }}
                                >
                                    Cancel
                                </Button>
                            </ButtonStrip>
                        </StandardFormSection>
                    </div>
                </form>
            )}
        </Form>
    )
}
