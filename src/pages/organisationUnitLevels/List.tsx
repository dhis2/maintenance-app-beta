import React, { useState } from 'react'
import css from '../../components/sectionList/SectionList.module.css'
import { SectionListTitle } from '../../components/sectionList/SectionListTitle'
import { Toolbar } from '../../components/sectionList/toolbar'
import { TranslationDialog } from '../../components/sectionList/translation'
import { BaseListModel } from '../../lib'
import { ListRows } from './ListRows'

export const Component = () => {
    const [translationDialogModel, setTranslationDialogModel] = useState<
        BaseListModel | undefined
    >(undefined)
    return (
        <div>
            <SectionListTitle />
            <div className={css.listDetailsWrapper}>
                <Toolbar
                    selectedModels={new Set()}
                    onDeselectAll={() => {}}
                    downloadable={false}
                />
                <ListRows onTranslationClick={setTranslationDialogModel} />
            </div>
            {translationDialogModel && (
                <TranslationDialog
                    model={translationDialogModel}
                    onClose={() => setTranslationDialogModel(undefined)}
                />
            )}
        </div>
    )
}
