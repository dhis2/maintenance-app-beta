/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FontStyle = {
    bold: boolean
    font: FontStyle.font
    fontSize: number
    italic: boolean
    textAlign: FontStyle.textAlign
    textColor: string
    underline: boolean
}

export namespace FontStyle {
    export enum font {
        ARIAL = 'ARIAL',
        SANS_SERIF = 'SANS_SERIF',
        VERDANA = 'VERDANA',
        ROBOTO = 'ROBOTO',
    }

    export enum textAlign {
        LEFT = 'LEFT',
        CENTER = 'CENTER',
        RIGHT = 'RIGHT',
    }
}
