import React from 'react'
import { DefaultSectionList } from '../DefaultSectionList'
import { PredictorListActions } from './PredictorListActions'

export const Component = () => (
    <DefaultSectionList ActionsComponent={PredictorListActions} />
)
