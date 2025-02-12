import { useConfig } from '@dhis2/app-runtime'
import {
    getNowInCalendar,
    generateFixedPeriods,
    createFixedPeriodFromPeriodId,
} from '@dhis2/multi-calendar-dates'
import { useEffect, useRef, useState } from 'react'
import { useField } from 'react-final-form'
import { DataInputPeriod } from '../../../../types/generated'
import { periodTypesMapping, SupportedCalendar } from './periodTypesMapping'

export type ExpandedDIP = DataInputPeriod & {
    periodInformation: {
        id: string
        displayName: string
    }
}

const useGetCurrentYear = (calendar: SupportedCalendar) => {
    const { systemInfo } = useConfig() || {}
    const serverTimeZoneId = systemInfo?.serverTimeZoneId ?? 'UTC'
    const temporalCalendar = getNowInCalendar(calendar, serverTimeZoneId)

    // extra logic for Ethopian calendar as we want the era year
    const year = ['ethiopian', 'ethiopic'].includes(calendar)
        ? temporalCalendar.eraYear
        : temporalCalendar.year
    return year
}

export const useGetPeriods = ({
    selectedYear,
    locale = 'en',
    calendar = 'gregory',
}: {
    selectedYear?: string
    locale?: string
    calendar?: SupportedCalendar
}) => {
    const { input } = useField('periodType')
    const selectedPeriodType = periodTypesMapping[input.value] ?? input.value
    const currentYear = useGetCurrentYear(calendar)
    const annual = Boolean(selectedPeriodType.match(/^(YEARLY|FY[A-Z]{3})/))
    const yearRange = currentYear
        ? Array.from({ length: 16 }, (_, i) => String(-11 + i + currentYear))
        : []
    const generateYear = selectedYear
    const periods = !selectedPeriodType
        ? []
        : annual
        ? generateFixedPeriods({
              year: Number(currentYear) + 5,
              yearsCount: 16,
              periodType:
                  periodTypesMapping[selectedPeriodType] ?? selectedPeriodType,
              calendar,
              locale,
          }).reverse()
        : generateFixedPeriods({
              year: Number(generateYear),
              periodType:
                  periodTypesMapping[selectedPeriodType] ?? selectedPeriodType,
              calendar,
              locale,
          })
    return {
        annual,
        periods,
        yearRange,
    }
}

export const useGetPeriodInformation = (
    dips: DataInputPeriod[],
    calendar: SupportedCalendar,
    locale: string
) => {
    const [mappedPeriods, setMappedPeriods] = useState<ExpandedDIP[]>([])
    const ref = useRef<string[]>([])
    useEffect(() => {
        const sortedDips = [...dips].sort((a, b) =>
            a.period.id.localeCompare(b.period.id)
        )
        const sortedDipIds = sortedDips.map((dip) => dip.period.id)

        if (sortedDipIds.every((id, index) => id === ref.current[index])) {
            setMappedPeriods((prevMappedPeriods) => {
                return prevMappedPeriods
                    .map((prevDIP) => {
                        const updatedDIP = dips.find(
                            (dip) => dip.period.id === prevDIP.period.id
                        )
                        if (!updatedDIP) {
                            return 'deleted'
                        }
                        return {
                            ...updatedDIP,
                            periodInformation: prevDIP.periodInformation,
                        }
                    })
                    .filter((dip) => dip !== 'deleted')
            })
            return
        } else {
            ref.current = sortedDipIds
            const updatedSortedPeriods = sortedDips
                .map((dip) => {
                    const periodInformation = createFixedPeriodFromPeriodId({
                        periodId: dip.period.id,
                        locale,
                        calendar,
                    })
                    return { periodInformation, ...dip }
                })
                .sort((a, b) =>
                    a.periodInformation.startDate.localeCompare(
                        b.periodInformation.startDate
                    )
                )

            setMappedPeriods(updatedSortedPeriods)
        }
    }, [dips, locale, calendar])

    return mappedPeriods
}
