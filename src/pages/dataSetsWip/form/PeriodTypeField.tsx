import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Field,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'

const PeriodTypeChangeWarningModal = ({
    onClose,
    confirmPeriodType,
    preselectedPeriodType,
}: {
    onClose: () => void
    confirmPeriodType: () => void
    preselectedPeriodType: string
}) => (
    <Modal onClose={onClose} position="middle">
        <ModalTitle>{i18n.t('Change period type')}</ModalTitle>
        <ModalContent>
            <p>
                {i18n.t(
                    'Changing the period type will make previously entered data for this data set not appear in the data entry app. This can lead to duplicate data entry.'
                )}
            </p>
            <p>
                {i18n.t(
                    'Are you sure you want to change the period type to {{preselectedPeriodType}}?',
                    { preselectedPeriodType }
                )}
            </p>
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                <Button destructive onClick={confirmPeriodType}>
                    {i18n.t('Yes, change')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

export function PeriodTypeField() {
    const { input, meta } = useField('periodType')
    const [preselectedPeriodType, setPreselectedPeriodType] = useState<
        string | null
    >(null)
    const id = useParams()?.id
    const isEdit = !!id

    return (
        <>
            {preselectedPeriodType && (
                <PeriodTypeChangeWarningModal
                    onClose={() => setPreselectedPeriodType(null)}
                    confirmPeriodType={() => {
                        input.onChange(preselectedPeriodType)
                        setPreselectedPeriodType(null)
                    }}
                    preselectedPeriodType={preselectedPeriodType}
                />
            )}

            <Field
                required
                name="periodType"
                label={i18n.t('Period type')}
                error={meta.touched && !!meta.error}
                validationText={meta.touched ? meta.error : undefined}
            >
                <PeriodTypeSelect
                    selected={input.value}
                    invalid={meta.touched && !!meta.error}
                    onChange={
                        !isEdit ? input.onChange : setPreselectedPeriodType
                    }
                />
            </Field>
        </>
    )
}
