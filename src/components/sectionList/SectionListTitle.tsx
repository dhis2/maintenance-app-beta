import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { PageTitle } from '../../app/layout/PageTitle'
import { useSectionHandle } from '../../lib'

export const SectionListTitle = () => {
    const section = useSectionHandle()
    if (!section) {
        return null
    }

    return (
        <PageTitle>
            {i18n.t('{{modelName}} management', { modelName: section.title })}
        </PageTitle>
    )
}
