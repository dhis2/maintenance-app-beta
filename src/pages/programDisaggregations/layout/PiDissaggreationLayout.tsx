import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { DefaultSectionedFormSidebar } from '../../../components'
import { SectionedFormProvider } from '../../../lib'
import styles from './PiDisaggregationLayout.module.css'

const PiDisaggregationLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div className={styles.layoutWrapper}>
            <SectionedFormProvider
                formDescriptor={{
                    name: 'programDisaggregationForm',
                    label: i18n.t('program_disaggregation_form'),
                    sections: [
                        {
                            name: 'programIndicatorMappings',
                            label: i18n.t('program_indicator_mappings'),
                            fields: [
                                {
                                    name: 'programIndicatorMappings',
                                    label: i18n.t('program_indicator_mappings'),
                                },
                            ],
                        },
                        {
                            name: 'disaggregationCategories',
                            label: i18n.t('disaggregation_categories'),
                            fields: [
                                {
                                    name: 'categoryMappings',
                                    label: i18n.t(
                                        'disaggregation_category_mappings'
                                    ),
                                },
                            ],
                        },
                    ],
                }}
            >
                <aside className={styles.sidebar}>
                    <DefaultSectionedFormSidebar />
                </aside>

                <main className={styles.content}>{children}</main>
            </SectionedFormProvider>
        </div>
    )
}

export default PiDisaggregationLayout

export const PiSectionedFormFooter = ({
    children,
}: {
    children?: React.ReactNode
}) => {
    return <div className={styles.footer}>{children}</div>
}

const FormActions = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.actions}>{children}</div>
)

FormActions.displayName = 'PiSectionedFormFooter.FormActions'

PiSectionedFormFooter.FormActions = FormActions
