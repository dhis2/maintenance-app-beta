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
        valueType: 'NUMBER',
        aggregationType: 'SUM',
        legendSet: [],
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
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementForm />

                        <StandardFormSection>
                            <ButtonStrip>
                                <Button
                                    primary
                                    disabled={submitting}
                                    type="submit"
                                >
                                    {submitting && (
                                        <span
                                            className={
                                                classes.saveButtonLoadingIcon
                                            }
                                        >
                                            <CircularLoader small />
                                        </span>
                                    )}
                                    Create data element
                                </Button>

                                <Button
                                    disabled={submitting}
                                    onClick={() => navigate(listPath)}
                                >
                                    Exit without saving
                                </Button>
                            </ButtonStrip>
                        </StandardFormSection>
                    </div>
                </form>
            )}
        </Form>
    )
}
