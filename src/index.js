import './locales'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import i18n from '@dhis2/d2-i18n'
import moment from 'moment'

changeLocale('en')
ReactDOM.render(<App />, document.getElementById('root'))

function isLangRTL(code) {
    const langs = ['ar', 'fa', 'ur']
    const prefixed = langs.map(c => `${c}-`)
    return (
        langs.includes(code) ||
        prefixed.filter(c => code.startsWith(c)).length > 0
    )
}

function changeLocale(locale) {
    moment.locale(locale)
    i18n.changeLanguage(locale)
    document.documentElement.setAttribute(
        'dir',
        isLangRTL(locale) ? 'rtl' : 'ltr'
    )
}
