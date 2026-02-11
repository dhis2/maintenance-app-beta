import React from 'react'
import { DefaultSectionList } from '../DefaultSectionList'
import { PredictorListActions } from '../predictors/PredictorListActions'

export const Component = () => (
    <DefaultSectionList ActionsComponent={PredictorListActions} />
)
