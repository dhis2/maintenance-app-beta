/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OutlierLine } from './OutlierLine'

export type OutlierAnalysis = {
    enabled: boolean
    extremeLines: OutlierLine
    normalizationMethod: OutlierAnalysis.normalizationMethod
    outlierMethod: OutlierAnalysis.outlierMethod
    thresholdFactor: number
}

export namespace OutlierAnalysis {
    export enum normalizationMethod {
        Y_RESIDUALS_LINEAR = 'Y_RESIDUALS_LINEAR',
    }

    export enum outlierMethod {
        IQR = 'IQR',
        STANDARD_Z_SCORE = 'STANDARD_Z_SCORE',
        MODIFIED_Z_SCORE = 'MODIFIED_Z_SCORE',
    }
}
