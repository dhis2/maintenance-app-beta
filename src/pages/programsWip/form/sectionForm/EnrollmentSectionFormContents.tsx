import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, Field, SingleSelectFieldFF } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import {
    Field as FieldRFF,
    useField,
    useForm,
    useFormState,
} from 'react-final-form'
import {
    DescriptionField,
    Drawer,
    DrawerFormFooter,
    FormFooterWrapper,
    NameField,
    SectionedFormErrorNotice,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    TransferHeader,
} from '../../../../components'
import { BaseModelTransfer } from '../../../../components/metadataFormControls/ModelTransfer/BaseModelTransfer'
import { useBoundResourceQueryFn } from '../../../../lib'
import { DisplayableModel } from '../../../../types/models'
import styles from './EnrollmentSectionFormContents.module.css'
import {
    enrollmentSectionSchemaSection,
    SectionFormValues,
} from './EntrollmentSectionForm'

export type EnrollmentSectionFormProps = {
    onCancel?: () => void
}

const displayOptions = [
    {
        label: i18n.t('Listing'),
        value: 'LISTING',
    },
    {
        label: i18n.t('Sequential'),
        value: 'SEQUENTIAL',
    },
    {
        label: i18n.t('Matrix'),
        value: 'MATRIX',
    },
]

export type ProgramAttributesType = {
    programTrackedEntityAttributes: {
        trackedEntityAttribute: DisplayableModel
    }[]
    programSections: { trackedEntityAttributes: { id: string }[]; id: string }[]
}

export const EnrollmentSectionFormContents = ({
    onCancel,
}: EnrollmentSectionFormProps) => {
    const form = useForm<SectionFormValues>()
    const { submitting, values } = useFormState({
        subscription: { submitting: true, values: true },
    })

    const { input: attributesInput, meta: attributesMeta } = useField<
        (DisplayableModel & { categoryCombo: { id: string } })[]
    >('trackedEntityAttributes', {
        multiple: true,
        validateFields: [],
    })

    const queryFn = useBoundResourceQueryFn()
    const { data, isLoading } = useQuery({
        queryFn: queryFn<ProgramAttributesType>,
        queryKey: [
            {
                resource: 'programs',
                id: values.program.id,
                params: {
                    fields: [
                        'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]',
                        'programSections[trackedEntityAttributes, id]',
                    ].concat(),
                },
            },
        ] as const,
    })

    const availableAttributes = useMemo(() => {
        if (!data?.programSections || !data?.programTrackedEntityAttributes) {
            return []
        }
        const otherSectionsAttributes = data.programSections
            .filter((section) => section.id !== values.id)
            .flatMap((section) =>
                section.trackedEntityAttributes?.map((tea) => tea.id)
            )

        return data.programTrackedEntityAttributes
            .map((tea) => tea.trackedEntityAttribute)
            .filter((tea) => !otherSectionsAttributes.includes(tea.id))
    }, [data, values.id])

    const formContent = (
        <div>
            <SectionedFormSections>
                <SectionedFormSection name="setup">
                    <StandardFormSectionTitle>
                        {i18n.t('Section setup')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Setup the basic information for this section.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <NameField
                            schemaSection={enrollmentSectionSchemaSection}
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <DescriptionField
                            helpText={i18n.t(
                                'Explain the purpose of this section.'
                            )}
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            inputWidth="500px"
                            name="renderType.DESKTOP.type"
                            render={(props) => (
                                <SingleSelectFieldFF
                                    {...props}
                                    label={i18n.t('Desktop display')}
                                    options={displayOptions}
                                />
                            )}
                            required
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <FieldRFF<string | undefined>
                            inputWidth="500px"
                            name="renderType.MOBILE.type"
                            render={(props) => (
                                <SingleSelectFieldFF
                                    {...props}
                                    label={i18n.t('Mobile display')}
                                    options={displayOptions}
                                />
                            )}
                            required
                        />
                    </StandardFormField>
                </SectionedFormSection>
                <SectionedFormSection name="sectionAttributes">
                    <StandardFormSectionTitle>
                        {i18n.t('Section attributes')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose what data is collected for this section.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <Field
                            error={attributesMeta.invalid}
                            validationText={
                                (attributesMeta.touched &&
                                    attributesMeta.error?.toString()) ||
                                ''
                            }
                            name="attributes"
                        >
                            <BaseModelTransfer
                                loading={isLoading}
                                selected={attributesInput.value}
                                onChange={({ selected }) => {
                                    attributesInput.onChange(selected)
                                    attributesInput.onBlur()
                                }}
                                leftHeader={
                                    <TransferHeader>
                                        {i18n.t('Available attributes')}
                                    </TransferHeader>
                                }
                                rightHeader={
                                    <TransferHeader>
                                        {i18n.t('Selected attributes')}
                                    </TransferHeader>
                                }
                                filterPlaceholder={i18n.t(
                                    'Search available attributes'
                                )}
                                filterPlaceholderPicked={i18n.t(
                                    'Search selected attributes'
                                )}
                                enableOrderChange
                                height={'350px'}
                                optionsWidth="500px"
                                selectedWidth="500px"
                                filterable
                                filterablePicked
                                available={[
                                    ...availableAttributes,
                                    ...attributesInput.value,
                                ]}
                                maxSelections={Infinity}
                            />
                        </Field>
                    </StandardFormField>
                </SectionedFormSection>
            </SectionedFormSections>
            <SectionedFormErrorNotice />
        </div>
    )

    if (onCancel) {
        return (
            <Drawer
                footer={
                    <DrawerFormFooter
                        submitLabel={i18n.t('Save section')}
                        cancelLabel={i18n.t('Cancel')}
                        submitting={submitting ?? false}
                        onSubmitClick={() => form.submit()}
                        onCancelClick={onCancel}
                        infoMessage={i18n.t(
                            'Saving a section does not save other changes to the program'
                        )}
                    />
                }
            >
                {formContent}
            </Drawer>
        )
    }

    return (
        <div className={styles.sectionsWrapper}>
            {formContent}
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            disabled={submitting}
                            type="button"
                            onClick={() => form.submit()}
                            loading={submitting}
                            dataTest="form-submit-button"
                        >
                            {i18n.t('Save section')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={submitting}
                            onClick={onCancel}
                            dataTest="form-cancel-link"
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                'Saving a section does not save other changes to the program'
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </div>
    )
}
