import { Button, ButtonStrip } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import classes from './Edit.module.css'
import { DataElementForm } from './form'

// @TODO(DataElements/edit): I suppose we want some of the initial values to be
//   dynamic? In that case, we'd have to load them and add loading/error UIs.
const INITIAL_VALUES = {
    legends: [],
    domain: 'aggregate',
    valueType: 'number',
    aggregationType: 'sum',
}

export const Component = () => {
    const navigate = useNavigate()
    const onSubmit = (values: object) => {
        console.log(
            '@TODO(DataElements/edit): Implement onSubmit; values:',
            values
        )
    }

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={INITIAL_VALUES}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementForm />
                    </div>

                    <div className={classes.formActions}>
                        <ButtonStrip>
                            <Button primary type="submit">
                                Save and close
                            </Button>

                            <Button
                                onClick={() => {
                                    alert('@TODO(Data elements/edit): Implement me!')
                                    navigate(-1)
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonStrip>
                    </div>
                </form>
            )}
        </Form>
    )
}
