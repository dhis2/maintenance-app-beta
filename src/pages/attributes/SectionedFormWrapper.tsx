import i18n from '@dhis2/d2-i18n'
import React, { ReactElement } from 'react'
import {
    DefaultFormFooter,
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
    FormBaseProps,
} from '../../components'
import {
    createFormError,
    SectionedFormDescriptor,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
    getSectionPath,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { Attribute, IdentifiableObjects } from '../../types/generated'

type FormBasePropsModifed<TValues, TFormattedValues = TValues> = Omit<
    FormBaseProps<TValues, TFormattedValues>,
    'children'
> & { children: ReactElement; cancelTo?: string }

export const AttributesFormDescriptor = {
    name: 'Attribute',
    label: 'Attributes',
    sections: [
        {
            name: 'basic',
            label: i18n.t('Basic information'),
            fields: [
                {
                    name: 'name',
                    label: i18n.t('Name'),
                },
                {
                    name: 'shortName',
                    label: i18n.t('Short name'),
                },
                {
                    name: 'code',
                    label: i18n.t('Code'),
                },
                {
                    name: 'description',
                    label: i18n.t('Description'),
                },
            ],
        },
        {
            name: 'data',
            label: i18n.t('Data and options'),
            fields: [
                {
                    name: 'optionSet',
                    label: i18n.t('Option set'),
                },
                {
                    name: 'valueType',
                    label: 'Value type',
                },
                {
                    name: 'sortOrder',
                    label: i18n.t('Sort order'),
                },
                {
                    name: 'mandatory',
                    label: i18n.t('Mandatory'),
                },
                {
                    name: 'unique',
                    label: i18n.t('Unique'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<Attribute>

export const SectionedFormWrapper = ({
    onSubmit,
    initialValues,
    validate,
    children,
    cancelTo,
}: FormBasePropsModifed<Attribute>) => (
    <FormBase
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        includeAttributes={false}
    >
        {({ handleSubmit }) => (
            <SectionedFormProvider formDescriptor={AttributesFormDescriptor}>
                <SectionedFormLayout sidebar={<DefaultSectionedFormSidebar />}>
                    <form onSubmit={handleSubmit}>
                        <>
                            {children}
                            <SectionedFormErrorNotice />
                        </>
                    </form>
                    <DefaultFormFooter cancelTo={cancelTo} />
                </SectionedFormLayout>
            </SectionedFormProvider>
        )}
    </FormBase>
)
