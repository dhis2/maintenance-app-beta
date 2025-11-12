import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, NoticeBox } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { TooltipWrapper } from '../../../components/tooltip'

export function TrigramIndexableField() {
    const { input: blockedOperatorsInput } = useField<string[]>(
        'blockedSearchOperators'
    )
    const { input: trigramIndexableInput } = useField<boolean>(
        'trigramIndexable',
        { subscription: { value: true } }
    )
    const { input: trigramIndexedInput } = useField<boolean | undefined>(
        'trigramIndexed',
        { subscription: { value: true } }
    )

    const blockedOperators = blockedOperatorsInput.value || []
    const bothEwAndLikeBlocked =
        blockedOperators.includes('EW') && blockedOperators.includes('LIKE')

    // Disable and uncheck trigramIndexable if both EW and LIKE are blocked
    React.useEffect(() => {
        if (bothEwAndLikeBlocked && trigramIndexableInput.value) {
            trigramIndexableInput.onChange(false)
        }
    }, [bothEwAndLikeBlocked, trigramIndexableInput])

    // Determine infobox message
    const infoboxMessage = useMemo(() => {
        if (!trigramIndexableInput.value) {
            return null
        }

        return trigramIndexedInput.value === true
            ? i18n.t(
                  'This attribute is currently trigram indexed in the database'
              )
            : i18n.t(
                  'This attribute is currently not trigram indexed in the database'
              )
    }, [trigramIndexableInput.value, trigramIndexedInput.value])

    return (
        <>
            <StandardFormField>
                <div style={{ display: 'inline-block' }}>
                    <TooltipWrapper
                        condition={bothEwAndLikeBlocked}
                        content={i18n.t(
                            'Not available when both EW and LIKE are blocked'
                        )}
                    >
                        <FieldRFF
                            component={CheckboxFieldFF}
                            dataTest="formfields-trigramIndexable"
                            name="trigramIndexable"
                            label={i18n.t('Mark for trigram indexing')}
                            helpText={i18n.t(
                                'Only relevant when using LIKE or EW based searches'
                            )}
                            type="checkbox"
                            disabled={bothEwAndLikeBlocked}
                            validateFields={[]}
                        />
                    </TooltipWrapper>
                </div>
            </StandardFormField>

            {infoboxMessage && (
                <StandardFormField>
                    <NoticeBox>{infoboxMessage}</NoticeBox>
                </StandardFormField>
            )}
        </>
    )
}
